import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel } from "@/components/ui/form";

// Schema xác thực dữ liệu với zod
const formSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
});

type FormSchemaType = z.infer<typeof formSchema>;

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const formMethods = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: FormSchemaType) => {
    console.log("Dữ liệu:", data);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Viền tối bao quanh Login/Register */}
      <div className="flex flex-col items-center gap-2 ">
      {/* Viền tối bao quanh Login/Register */}
      <div className="w-[410px] rounded-lg border border-gray-700 p-1 bg-slate-100 dark:bg-slate-500">

        {/* Phần chọn Login/Register */}
        <div className="w-full flex gap-1">
          {/* Nút Đăng nhập */}
          <button
            className={`flex-1 py-2 text-base font-semibold rounded-lg transition ${
              isLogin ? "bg-white text-black" : "bg-slate-100 dark:bg-slate-500"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Đăng nhập
          </button>

          {/* Nút Đăng ký */}
          <button
              className={`flex-1 py-2 text-base font-semibold rounded-lg transition ${
                !isLogin ? "bg-white text-black" : "bg-slate-100 dark:bg-slate-500"
              }`}
              onClick={() => navigate("/register")}
            >
              Đăng ký
          </button>
        </div>
      </div>
    </div>


      {/* Form đăng nhập/đăng ký */}
      <div className="p-6 border border-gray-300 bg-white dark:bg-zinc-800 rounded-lg w-[400px] mt-1">
        <h2 className="text-center text-xl font-semibold text-black dark:text-white">
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </h2>

        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-3 mt-2">
            {/* Input Email */}
            <FormItem>
              <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                Email
              </FormLabel>
              <Controller
                name="email"
                control={formMethods.control}
                render={({ field }) => (
                  <Input
                    type="email"
                    placeholder="Nhập email"
                    className="w-full p-3 bg-slate-100 dark:bg-slate-500 text-black border-none dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...field}
                  />
                )}
              />
            </FormItem>

            {/* Input Mật khẩu */}
            <FormItem>
              <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                Mật khẩu
              </FormLabel>
              <Controller
                name="password"
                control={formMethods.control}
                render={({ field }) => (
                  <Input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    className="w-full p-3 bg-slate-100 dark:bg-slate-500 text-black border-none dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...field}
                  />
                )}
              />
            </FormItem>

            {/* Nút đăng nhập/đăng ký */}
            <Button type="submit" className="w-full py-3 text-lg bg-black text-white hover:bg-slate-600">
              {isLogin ? "Đăng nhập" : "Đăng ký"}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default LoginForm;
