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
    username: z.string().min(3, "User name must contain at least 3 Characters"),
    email: z.string().email("Email not Valid"),
    password: z.string().min(6, "Password must contain at least 6 characters"),
    phone: z.string().regex(/^[0-9]{10,11}$/, "Phone Number not Valid"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirm Password not Match",
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

  const [displayedError, setDisplayedError] = useState<string | null>(null);
  const { errors, isSubmitting } = formMethods.formState;
  
  useEffect(() => {
    if (isSubmitting) {
      setDisplayedError(null); // Reset lỗi khi bắt đầu submit
    }
  
    if (errors) {
      const firstError = Object.values(errors)[0]?.message as string | undefined;
      if (firstError && firstError !== displayedError) {
        setDisplayedError(firstError);
        toast.error(firstError);
      }
    }
  }, [errors, isSubmitting, displayedError]);

  const onSubmit = async (data: FormSchemaType) => {
    try {
      const response = await apiSignUp(data);
      console.log(response.status)
      if (response.status === 200) {  
        if (response.data.status !== "success") {
          // Kiểm tra từng lỗi cụ thể

          switch (response.data.message) {
            case "All fields are required":
              toast.error("Please enter full information.");
              break;
            case "Invalid email format":
              toast.error("Invalid Email Format.");
              break;
            case "Password and Confirm Password do not match":
              toast.error("Password and Confirm Password do not match.");
              break;
            case "The email is already in the database":
              toast.error("The Email is already Exists.");
              break;
            case "The phone is already in the database":
              toast.error("The Phone Number is already Exists.");
              break;
            default:
              toast.error(response.data.message);
              break;
          }
          return;
        }
  
        toast.success("Sign Up Successfully!");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Error Sign Up. Please try again!");
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
            Sign In
          </button>
          <button
            className={`flex-1 py-2 text-base font-semibold rounded-lg transition ${
              !isLogin ? "bg-white text-black" : "bg-slate-100 dark:bg-slate-500"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
      </div>
      <div className="w-[400px] p-6  bg-white dark:bg-zinc-800 rounded-lg">
        <h2 className="text-center text-xl font-semibold text-black dark:text-white">Sign Up</h2>
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-3 mt-2">
            <FormItem>
              <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                User's Name
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
                render={({ field }) => <Input type="email" placeholder="Enter Email" className="w-full p-3 bg-slate-100 dark:bg-slate-500 text-black border-none dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />}
              />
            </FormItem>
            <FormItem>
              <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">Phone Number</FormLabel>
              <Controller
                name="phone"
                control={formMethods.control}
                render={({ field }) => <Input type="text" placeholder="Enter Phone Number" className="w-full p-3 bg-slate-100 dark:bg-slate-500 text-black border-none dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />}
              />
            </FormItem>
            <FormItem>
              <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">Password</FormLabel>
              <Controller
                name="password"
                control={formMethods.control}
                render={({ field }) => <Input type="password" placeholder="Enter Password" className="w-full p-3 bg-slate-100 dark:bg-slate-500 text-black border-none dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />}
              />
            </FormItem>
            <FormItem>
              <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">Confirm Password</FormLabel>
              <Controller
                name="confirmPassword"
                control={formMethods.control}
                render={({ field }) => <Input type="password" placeholder="Enter Confirm Password" className="w-full p-3 bg-slate-100 dark:bg-slate-500 text-black border-none dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0" {...field} />}
              />
            </FormItem>
            <Button type="submit" className="w-full py-3 text-lg bg-black text-white hover:bg-slate-600">
              Sign Up
            </Button>
            <div className="flex justify-center mt-2">
              <Button onClick={() => navigate("/")} className="w-1/2 py-3 text-lg bg-gray-500 text-white hover:bg-gray-400">
              Back to Home
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default RegisterForm;
