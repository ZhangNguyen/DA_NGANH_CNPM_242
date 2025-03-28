import { useState, useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel } from "@/components/ui/form";

import { apiSignUp } from '@/apis/auth'

import { toast } from "react-hot-toast";
// Schema xác thực dữ liệu với zod

const formSchema = z
  .object({
    username: z.string().min(3, "Tên người dùng ít nhất 3 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
    phone: z.string().regex(/^[0-9]{10,11}$/, "Số điện thoại không hợp lệ"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type FormSchemaType = z.infer<typeof formSchema>;

const RegisterForm = () => {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const formMethods = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      phone: "",
      confirmPassword: "",
    },
    
  });
  
  const onSubmit = async (data: FormSchemaType) => {
    try {
      const response = await apiSignUp(data);
  console.log(response.status)
      if (response.status === 200) {  
        if (response.data.status !== "success") {
          // Kiểm tra từng lỗi cụ thể

          switch (response.data.message) {
            case "All fields are required":
              toast.error("Vui lòng điền đầy đủ thông tin.");
              break;
            case "Invalid email format":
              toast.error("Email không đúng định dạng.");
              break;
            case "Password and Confirm Password do not match":
              toast.error("Mật khẩu và xác nhận mật khẩu không khớp.");
              break;
            case "The email is already in the database":
              toast.error("Email đã tồn tại.");
              break;
            case "The phone is already in the database":
              toast.error("Số điện thoại đã tồn tại.");
              break;
            default:
              toast.error(response.data.message);
              break;
          }
          return;
        }
  
        toast.success("Đăng ký thành công!");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Đăng ký thất bại. Vui lòng thử lại!");
    }
  };
  
  console.log(import.meta.env.VITE_BACKEND_URL)

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-[400px] rounded-lg p-1 bg-slate-100 dark:bg-slate-500">
        <div className="w-full flex gap-1">
          <button
            className={`flex-1 py-2 text-base font-semibold rounded-lg transition ${
              isLogin ? "bg-white text-black" : "bg-slate-100 dark:bg-slate-500"
            }`}
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </button>
          <button
            className={`flex-1 py-2 text-base font-semibold rounded-lg transition ${
              !isLogin ? "bg-white text-black" : "bg-slate-100 dark:bg-slate-500"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Đăng ký
          </button>
        </div>
      </div>
      <div className="w-[400px] p-6  bg-white dark:bg-zinc-800 rounded-lg">
        <h2 className="text-center text-xl font-semibold text-black dark:text-white">Đăng ký</h2>
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-3 mt-2">
            <FormItem>
              <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                Tên người dùng
              </FormLabel>
              <Controller
                name="username"
                control={formMethods.control}
                render={({ field }) => <Input type="text" placeholder="Nhập tên người dùng" className="w-full p-3 bg-slate-100 dark:bg-slate-500 text-black border-none dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />}
              />
            </FormItem>
            <FormItem>
              <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">Email</FormLabel>
              <Controller
                name="email"
                control={formMethods.control}
                render={({ field }) => <Input type="email" placeholder="Nhập email" className="w-full p-3 bg-slate-100 dark:bg-slate-500 text-black border-none dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />}
              />
            </FormItem>
            <FormItem>
              <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">Số điện thoại</FormLabel>
              <Controller
                name="phone"
                control={formMethods.control}
                render={({ field }) => <Input type="text" placeholder="Nhập số điện thoại" className="w-full p-3 bg-slate-100 dark:bg-slate-500 text-black border-none dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />}
              />
            </FormItem>
            <FormItem>
              <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">Mật khẩu</FormLabel>
              <Controller
                name="password"
                control={formMethods.control}
                render={({ field }) => <Input type="password" placeholder="Nhập mật khẩu" className="w-full p-3 bg-slate-100 dark:bg-slate-500 text-black border-none dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />}
              />
            </FormItem>
            <FormItem>
              <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">Xác nhận mật khẩu</FormLabel>
              <Controller
                name="confirmPassword"
                control={formMethods.control}
                render={({ field }) => <Input type="password" placeholder="Nhập lại mật khẩu" className="w-full p-3 bg-slate-100 dark:bg-slate-500 text-black border-none dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />}
              />
            </FormItem>
            <Button type="submit" className="w-full py-3 text-lg bg-black text-white hover:bg-slate-600">
              Đăng ký
            </Button>
            <div className="flex justify-center mt-2">
              <Button onClick={() => navigate("/")} className="w-1/2 py-3 text-lg bg-gray-500 text-white hover:bg-gray-400">
              Trở về trang chủ
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default RegisterForm;
