import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  BookOpen,
  Bot,
  Eye,
  EyeOff,
  Info,
  LockKeyhole,
  LogIn,
  Mail,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface LoginScreenProps {
  wordmark: ReactNode;
  onLogin: (remember: boolean) => void;
}

interface LoginErrors {
  email?: string;
  password?: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const benefits = [
  {
    icon: BookOpen,
    title: "Bài học cá nhân hóa",
    description: "Theo dõi tiến độ đọc và viết trong một không gian.",
  },
  {
    icon: Bot,
    title: "Gia sư AI song ngữ",
    description: "Luyện hội thoại, ngữ pháp và từ vựng bất cứ lúc nào.",
  },
  {
    icon: TrendingUp,
    title: "Duy trì động lực",
    description: "Xây dựng streak học tập và quan sát sự tiến bộ mỗi ngày.",
  },
];

export function LoginScreen({ wordmark, onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (submitTimer.current) clearTimeout(submitTimer.current);
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const normalizedEmail = email.trim();
    const nextErrors: LoginErrors = {};

    if (!normalizedEmail) {
      nextErrors.email = "Vui lòng nhập email.";
    } else if (!emailPattern.test(normalizedEmail)) {
      nextErrors.email = "Email chưa đúng định dạng.";
    }

    if (!password) {
      nextErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (password.length < 6) {
      nextErrors.password = "Mật khẩu cần có ít nhất 6 ký tự.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setShowForgotPassword(false);
    setIsSubmitting(true);
    submitTimer.current = setTimeout(() => {
      onLogin(remember);
      submitTimer.current = null;
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background grid lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden lg:flex overflow-hidden bg-gradient-to-br from-primary via-slate-800 to-slate-950 p-10 xl:p-16 text-primary-foreground">
        <div className="absolute -left-20 -top-20 size-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -right-24 size-96 rounded-full bg-accent/20" />
        <div className="absolute left-1/2 top-1/3 size-40 rounded-full border border-white/10" />

        <div className="relative z-10 flex w-full max-w-xl flex-col">
          <div className="flex items-center justify-center">
            <div className="rounded-2xl bg-white px-4 py-2 text-foreground shadow-lg shadow-slate-950/10">
              {wordmark}
            </div>
          </div>

          <div className="my-auto py-12">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-widest backdrop-blur-sm">
              <Sparkles size={14} />
              English learning community
            </div>
            <p className="max-w-lg text-4xl font-extrabold leading-tight tracking-tight xl:text-5xl">
              Mỗi ngày một bước nhỏ, tiếng Anh tiến bộ thật xa.
            </p>
            <p className="mt-4 max-w-lg text-base font-semibold leading-relaxed text-primary-foreground/80">
              Học đúng nhịp độ của bạn với bài luyện tập, theo dõi tiến độ và trợ lý AI luôn sẵn sàng đồng hành.
            </p>

            <div className="mt-10 grid gap-4">
              {benefits.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <Icon size={19} />
                  </div>
                  <div>
                    <p className="text-sm font-black">{title}</p>
                    <p className="mt-0.5 text-xs font-semibold leading-relaxed text-primary-foreground/70">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs font-semibold text-primary-foreground/60">
            Học tập chủ động. Tiến bộ bền vững.
          </p>
        </div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center p-5 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-center lg:hidden">
            {wordmark}
          </div>

          <div className="rounded-3xl border-2 border-border bg-card p-6 shadow-xl shadow-primary/5 sm:p-8">
            <div className="mb-7">
              <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <LogIn size={22} />
              </div>
              <p className="text-2xl font-extrabold tracking-tight text-foreground">
                Chào mừng trở lại!
              </p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground">
                Đăng nhập để tiếp tục hành trình học tiếng Anh cùng Brainsy.
              </p>
            </div>

            {showForgotPassword && (
              <Alert className="mb-5 border-primary/20 bg-primary/5">
                <Info />
                <AlertTitle>Khôi phục mật khẩu</AlertTitle>
                <AlertDescription>
                  Tính năng này cần kết nối backend. Trong bản demo, bạn có thể đăng nhập bằng bất kỳ email hợp lệ nào.
                </AlertDescription>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Đóng thông báo"
                  onClick={() => setShowForgotPassword(false)}
                  className="absolute right-2 top-2 size-7 rounded-lg text-muted-foreground"
                >
                  <X size={14} />
                </Button>
              </Alert>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="font-black text-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "login-email-error" : undefined}
                    onChange={event => {
                      setEmail(event.target.value);
                      if (errors.email) setErrors(current => ({ ...current, email: undefined }));
                    }}
                    placeholder="ban@example.com"
                    className="h-12 rounded-2xl border-2 border-border pl-10 text-sm font-semibold focus-visible:border-primary"
                  />
                </div>
                {errors.email && (
                  <p id="login-email-error" role="alert" className="text-xs font-bold text-destructive">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password" className="font-black text-foreground">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "login-password-error" : undefined}
                    onChange={event => {
                      setPassword(event.target.value);
                      if (errors.password) setErrors(current => ({ ...current, password: undefined }));
                    }}
                    placeholder="Nhập mật khẩu của bạn"
                    className="h-12 rounded-2xl border-2 border-border px-10 text-sm font-semibold focus-visible:border-primary"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isSubmitting}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    onClick={() => setShowPassword(visible => !visible)}
                    className="absolute right-1.5 top-1/2 size-9 -translate-y-1/2 rounded-xl text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </Button>
                </div>
                {errors.password && (
                  <p id="login-password-error" role="alert" className="text-xs font-bold text-destructive">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember-login"
                    checked={remember}
                    disabled={isSubmitting}
                    onCheckedChange={checked => setRemember(checked === true)}
                  />
                  <Label htmlFor="remember-login" className="cursor-pointer text-xs font-bold text-muted-foreground">
                    Ghi nhớ đăng nhập
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setShowForgotPassword(true)}
                  className="h-auto p-0 text-xs font-black"
                >
                  Quên mật khẩu?
                </Button>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-2xl text-sm font-black shadow-lg shadow-primary/20"
              >
                <LogIn size={17} />
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>

            <div className="mt-6 rounded-2xl bg-muted/70 px-4 py-3 text-center">
              <p className="text-[11px] font-semibold leading-relaxed text-muted-foreground">
                Bản demo — dùng bất kỳ email hợp lệ và mật khẩu từ 6 ký tự.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
