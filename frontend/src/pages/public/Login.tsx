import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FormProvider, Controller, set } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel } from "@/components/ui/form";

import { useUserStore } from "@/store/useUserStore";

import { toast } from "react-hot-toast";
// Schema xác thực dữ liệu với zod
const formSchema = z.object({
  email: z.string().email("Email not Valid"),
  password: z.string().min(6, "Password must contain at least 6 characters"),
});

type FormSchemaType = z.infer<typeof formSchema>;

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { signIn, isAuthenticating } = useUserStore()

  const formMethods = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormSchemaType) => {
    const response = await signIn(data);
    if (!response) {
      toast.error("Sign In Error. Wrong Email or Password!");
      return;
    }
    toast.success("Sign In Successfully!");
    navigate('/');
  };
  
  return (
    
    <div className="flex flex-col items-center gap-2">
      {/* Viền tối bao quanh Login/Register */}
      <div className="flex flex-col items-center gap-2 ">
      {/* Viền tối bao quanh Login/Register */}
      <div className="w-[410px] rounded-lg p-1 bg-slate-100 dark:bg-slate-500">

        {/* Phần chọn Login/Register */}
        <div className="w-full flex gap-1">
          {/* Nút Đăng nhập */}
          <button
            className={`flex-1 py-2 text-base font-semibold rounded-lg transition ${
              isLogin ? "bg-white text-black" : "bg-slate-100 dark:bg-slate-500"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Sign In
          </button>

          {/* Nút Đăng ký */}
          <button
              className={`flex-1 py-2 text-base font-semibold rounded-lg transition ${
                !isLogin ? "bg-white text-black" : "bg-slate-100 dark:bg-slate-500"
              }`}
              onClick={() => navigate("/register")}
            >
              Sign Up
          </button>
        </div>
      </div>
    </div>


      {/* Form đăng nhập/đăng ký */}
      <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg w-[400px] mt-1">
        <h2 className="text-center text-xl font-semibold text-black dark:text-white">
          {isLogin ? "Sign In" : "Sign Up"}
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
                    placeholder="Enter Email"
                    className="w-full p-3 bg-slate-100 dark:bg-slate-500 text-black border-none dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...field}
                  />
                )}
              />
            </FormItem>

            {/* Input Mật khẩu */}
            <FormItem>
              <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                Password
              </FormLabel>
              <Controller
                name="password"
                control={formMethods.control}
                render={({ field }) => (
                  <Input
                    type="password"
                    placeholder="Enter Password"
                    className="w-full p-3 bg-slate-100 dark:bg-slate-500 text-black border-none dark:text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                    {...field}
                  />
                )}
              />
            </FormItem>

            {/* Nút đăng nhập/đăng ký */}
            <Button type="submit" className="w-full py-3 text-lg bg-black text-white hover:bg-slate-600">
              {isLogin ? "Sign In" : "Sign Up"}
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

export default LoginForm;
