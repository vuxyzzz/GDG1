import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Bot,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  Clipboard,
  Clock3,
  Copy,
  FileText,
  FolderOpen,
  GraduationCap,
  History,
  Home,
  Library,
  Lightbulb,
  Link2,
  LogOut,
  Menu,
  MessageSquareText,
  Paperclip,
  RefreshCw,
  Search,
  Send,
  Settings,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { ScrollArea } from "./components/ui/scroll-area";
import { Textarea } from "./components/ui/textarea";
import { LoginScreen } from "./components/LoginScreen";

type View = "home" | "chat" | "resources" | "profile";
type ResourceType = "Tất cả" | "Tài liệu" | "Bài tập" | "Lộ trình";

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  error?: boolean;
}

const AUTH_STORAGE_KEY = "brainsy-authenticated";
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1531496378573-7be09a2697d8?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200";

const resources = [
  { id: 1, type: "Lộ trình", icon: GraduationCap, title: "Lộ trình IELTS 6.5 trong 16 tuần", description: "Kế hoạch học từng tuần, bài kiểm tra đầu vào và mốc đánh giá tiến độ.", meta: "16 tuần · 32 bài", tone: "bg-indigo-50 text-indigo-600" },
  { id: 2, type: "Tài liệu", icon: FileText, title: "Tổng hợp ngữ pháp THPT trọng tâm", description: "Hệ thống 18 chuyên đề ngữ pháp kèm ví dụ và bài tập có đáp án.", meta: "PDF · 48 trang", tone: "bg-sky-50 text-sky-600" },
  { id: 3, type: "Bài tập", icon: BrainCircuit, title: "Bộ đề luyện đọc hiểu B1–B2", description: "12 bài đọc theo chủ đề với giải thích từ vựng và chiến lược làm bài.", meta: "12 bài · Có đáp án", tone: "bg-emerald-50 text-emerald-600" },
  { id: 4, type: "Tài liệu", icon: BookOpen, title: "300 từ vựng học thuật thông dụng", description: "Flashcard có ví dụ theo ngữ cảnh, phát âm và lịch ôn tập ngắt quãng.", meta: "300 từ · Flashcard", tone: "bg-violet-50 text-violet-600" },
  { id: 5, type: "Bài tập", icon: Clipboard, title: "Luyện viết câu học thuật", description: "Thực hành diễn đạt lại câu và nhận gợi ý cải thiện từ Brainsy AI.", meta: "20 bài · Có chấm điểm", tone: "bg-amber-50 text-amber-600" },
  { id: 6, type: "Lộ trình", icon: TrendingUp, title: "Ôn thi tiếng Anh THPT Quốc gia", description: "Lộ trình 8 tuần bám sát cấu trúc đề, ưu tiên các phần dễ mất điểm.", meta: "8 tuần · 24 bài", tone: "bg-rose-50 text-rose-600" },
] as const;

const quickActions = [
  { icon: Bot, title: "Hỏi Brainsy AI", description: "Giải thích bài tập tức thì", view: "chat" as View, tone: "bg-indigo-50 text-primary" },
  { icon: Library, title: "Tra cứu tài liệu", description: "Tìm giáo trình và bài tập", view: "resources" as View, tone: "bg-sky-50 text-sky-600" },
  { icon: Zap, title: "Luyện nhanh 10 phút", description: "Bài học ngắn theo mục tiêu", view: "resources" as View, tone: "bg-amber-50 text-amber-600" },
  { icon: TrendingUp, title: "Xem tiến độ", description: "Theo dõi mục tiêu tuần", view: "profile" as View, tone: "bg-emerald-50 text-emerald-600" },
];

const suggestedPrompts = [
  "Giải thích bài toán này theo từng bước",
  "Gợi ý lộ trình ôn thi IELTS 6.5",
  "Kiểm tra và sửa đoạn văn tiếng Anh",
  "Tạo 5 câu hỏi ôn tập về thì quá khứ",
];

function BrainsyLogo({ size = 40 }: { size?: number }) {
  return (
    <span
      role="img"
      aria-label="Brainsy — biểu tượng chữ B kết hợp hình não"
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-gradient-to-br from-indigo-500 via-indigo-700 to-slate-950 shadow-md shadow-indigo-200/50 ring-1 ring-indigo-300/40 ${size >= 48 ? "size-13" : "size-10"}`}
    >
      <span className="absolute inset-px rounded-[13px] border border-white/15" />
      <span className="relative block h-7 w-6" aria-hidden="true">
        <span className="absolute left-0 top-0 h-7 w-1 rounded-full bg-white" />
        <span className="absolute left-1 top-0 h-3.5 w-5 rounded-r-full border-2 border-l-0 border-white" />
        <span className="absolute bottom-0 left-1 h-3.5 w-5 rounded-r-full border-2 border-l-0 border-white" />
        <span className="absolute right-1 top-1.5 size-1 rounded-full bg-indigo-200" />
        <span className="absolute bottom-1.5 right-1 size-1 rounded-full bg-indigo-200" />
        <span className="absolute right-0.5 top-1/2 h-px w-3 -translate-y-1/2 bg-white/45" />
      </span>
    </span>
  );
}

function BrainsyWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap ${className}`} aria-label="Brainsy">
      <span className="text-2xl font-bold tracking-[-0.045em]">Brainsy</span>
    </span>
  );
}

function PageTitle({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div>
      {eyebrow && <p className="mb-2 text-sm font-semibold text-primary">{eyebrow}</p>}
      <div role="heading" aria-level={1} className="text-3xl font-bold tracking-tight text-foreground">{title}</div>
      {description && <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>}
    </div>
  );
}

function SectionHeading({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <div role="heading" aria-level={2} className="text-xl font-bold tracking-tight">{title}</div>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function AppHeader({ view, setView, onLogout }: { view: View; setView: (view: View) => void; onLogout: () => void }) {
  const navItems = [
    { label: "Trang chủ", value: "home" as View, icon: Home },
    { label: "Trợ lý AI", value: "chat" as View, icon: Bot },
    { label: "Thư viện", value: "resources" as View, icon: Library },
    { label: "Tiến độ", value: "profile" as View, icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-8 px-8">
        <Button type="button" variant="ghost" onClick={() => setView("home")} className="h-auto shrink-0 gap-2.5 p-0 hover:bg-transparent" aria-label="Về trang chủ">
          <BrainsyWordmark className="h-8 w-40 text-foreground" />
        </Button>
        <nav className="flex h-full flex-1 items-center justify-center gap-1" aria-label="Điều hướng chính">
          {navItems.map(({ label, value, icon: Icon }) => (
            <Button
              key={value}
              type="button"
              variant="ghost"
              onClick={() => setView(value)}
              className={`h-10 rounded-xl px-4 text-sm font-semibold ${view === value ? "bg-secondary text-primary hover:bg-secondary" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Icon size={17} /> {label}
            </Button>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Button type="button" variant="ghost" size="icon" className="relative size-10 rounded-xl text-muted-foreground" aria-label="Thông báo">
            <Bell size={18} />
            <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-primary" />
          </Button>
          <Button type="button" variant="ghost" onClick={() => setView("profile")} className="h-11 gap-2.5 rounded-xl px-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">NA</span>
            <span className="hidden text-left xl:block">
              <span className="block text-sm font-semibold leading-none">Nguyễn An</span>
              <span className="mt-1 block text-[11px] font-medium text-muted-foreground">Học viên</span>
            </span>
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={onLogout} className="size-10 rounded-xl text-muted-foreground hover:text-destructive" aria-label="Đăng xuất">
            <LogOut size={17} />
          </Button>
        </div>
      </div>
    </header>
  );
}

function HomeScreen({ setView, askAI }: { setView: (view: View) => void; askAI: (prompt: string) => void }) {
  const [query, setQuery] = useState("");
  const submit = () => {
    if (query.trim()) askAI(query.trim());
    else setView("chat");
  };

  return (
    <main className="mx-auto max-w-[1440px] px-8 py-8">
      <section className="grid min-h-[390px] grid-cols-12 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50">
        <div className="col-span-7 flex flex-col justify-center p-10 xl:p-12">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
            <Sparkles size={14} /> Trợ lý học tập AI dành cho bạn
          </div>
          <div role="heading" aria-level={1} className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-950">
            Học đúng cách, tìm câu trả lời nhanh hơn.
          </div>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            Hỏi bài, tra cứu tài liệu và xây dựng lộ trình học tập cá nhân hóa trong một không gian duy nhất.
          </p>
          <div className="mt-7 flex max-w-2xl items-center gap-2 rounded-2xl border border-border bg-white p-2 shadow-lg shadow-indigo-100/60 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
            <span className="ml-2 flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"><Bot size={18} /></span>
            <Input
              value={query}
              onChange={event => setQuery(event.target.value)}
              onKeyDown={event => event.key === "Enter" && submit()}
              className="h-11 flex-1 border-0 bg-transparent px-2 text-base shadow-none focus-visible:ring-0"
              placeholder="Hỏi Brainsy AI bất kỳ điều gì..."
              aria-label="Nhập câu hỏi cho Brainsy AI"
            />
            <Button type="button" onClick={submit} className="h-11 rounded-xl px-5 font-semibold shadow-none">
              Hỏi ngay <ArrowRight size={16} />
            </Button>
          </div>
          <p className="mt-3 text-xs text-slate-500">Gợi ý: “Lập kế hoạch ôn IELTS 6.5 trong 4 tháng”</p>
        </div>
        <div className="relative col-span-5 m-5 ml-0 overflow-hidden rounded-2xl">
          <img src={HERO_IMAGE} alt="Sinh viên cùng học tập và trao đổi trên máy tính" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 size={19} /></span>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-900">Mục tiêu tuần này</p>
                <p className="mt-0.5 text-xs text-slate-500">4/5 buổi học đã hoàn thành</p>
              </div>
              <span className="text-sm font-bold text-emerald-600">80%</span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-4/5 rounded-full bg-emerald-500" /></div>
          </div>
        </div>
      </section>

      <section className="py-8" aria-labelledby="quick-access">
        <SectionHeading title="Bạn muốn làm gì?" description="Truy cập nhanh các công cụ học tập thường dùng" />
        <div className="grid grid-cols-4 gap-4">
          {quickActions.map(({ icon: Icon, title, description, view, tone }) => (
            <Button key={title} type="button" variant="ghost" onClick={() => setView(view)} className="group h-auto justify-start rounded-2xl border border-border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-md">
              <span className={`mr-3 flex size-11 shrink-0 items-center justify-center rounded-xl ${tone}`}><Icon size={20} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-foreground">{title}</span>
                <span className="mt-1 block text-xs font-normal text-muted-foreground">{description}</span>
              </span>
              <ChevronRight size={16} className="text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </Button>
          ))}
        </div>
      </section>

      <section className="pb-10" aria-labelledby="featured-resources">
        <SectionHeading
          title="Tài liệu dành cho bạn"
          description="Đề xuất dựa trên mục tiêu và hoạt động gần đây"
          action={<Button type="button" variant="ghost" onClick={() => setView("resources")} className="rounded-xl text-sm font-semibold text-primary">Xem thư viện <ArrowRight size={15} /></Button>}
        />
        <div className="grid grid-cols-3 gap-4">
          {resources.slice(0, 3).map(({ id, icon: Icon, type, title, description, meta, tone }) => (
            <article key={id} className="rounded-2xl border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <span className={`flex size-11 items-center justify-center rounded-xl ${tone}`}><Icon size={20} /></span>
                <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">{type}</span>
              </div>
              <div role="heading" aria-level={3} className="mt-5 text-base font-bold leading-6">{title}</div>
              <p className="mt-2 min-h-10 text-sm leading-5 text-muted-foreground">{description}</p>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs font-medium text-muted-foreground">{meta}</span>
                <Button type="button" variant="ghost" onClick={() => setView("resources")} className="h-8 rounded-lg px-2 text-xs font-semibold text-primary">Mở tài liệu <ArrowRight size={13} /></Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function ChatScreen({ initialPrompt }: { initialPrompt: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    initialPrompt ? [{ id: 1, role: "user", content: initialPrompt }] : []
  );
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(Boolean(initialPrompt));
  const [attachment, setAttachment] = useState("");
  const [feedback, setFeedback] = useState<Record<number, "up" | "down">>({});
  const endRef = useRef<HTMLDivElement | null>(null);
  const nextId = useRef(initialPrompt ? 1 : 0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const answer = (prompt: string) => {
    if (prompt.toLocaleLowerCase("vi-VN").includes("lỗi mạng")) {
      setMessages(current => [...current, { id: ++nextId.current, role: "assistant", content: "Không thể kết nối tới Brainsy AI. Vui lòng kiểm tra mạng và thử lại.", error: true }]);
      setTyping(false);
      return;
    }
    setMessages(current => [...current, {
      id: ++nextId.current,
      role: "assistant",
      content: "Mình sẽ giúp bạn theo cách dễ hiểu nhất. Trước tiên, hãy xác định mục tiêu và chia nội dung thành các bước nhỏ. Với dạng bài này, bạn nên tập trung vào từ khóa, kiến thức nền liên quan và kiểm tra lại kết quả sau mỗi bước.",
    }]);
    setTyping(false);
  };

  useEffect(() => {
    if (!initialPrompt) return;
    const timer = window.setTimeout(() => answer(initialPrompt), 750);
    return () => window.clearTimeout(timer);
  }, [initialPrompt]);

  const send = (prompt?: string) => {
    const content = (prompt ?? input).trim();
    if (!content || typing) return;
    setMessages(current => [...current, { id: ++nextId.current, role: "user", content: attachment ? `${content}\nĐính kèm: ${attachment}` : content }]);
    setInput("");
    setAttachment("");
    setTyping(true);
    window.setTimeout(() => answer(content), 750);
  };

  const retry = (id: number) => {
    setMessages(current => current.filter(message => message.id !== id));
    setTyping(true);
    window.setTimeout(() => answer("thử lại"), 650);
  };

  return (
    <main className="mx-auto grid h-[calc(100vh-64px)] max-w-[1440px] grid-cols-[240px_minmax(0,1fr)_292px] bg-white">
      <aside className="flex min-h-0 flex-col border-r border-border bg-slate-50/70 p-4">
        <Button type="button" onClick={() => setMessages([])} className="h-11 w-full justify-start rounded-xl font-semibold shadow-none">
          <MessageSquareText size={17} /> Cuộc trò chuyện mới
        </Button>
        <div className="mb-2 mt-6 flex items-center justify-between px-2">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Gần đây</p>
          <History size={14} className="text-muted-foreground" />
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-1 pr-2">
            {["Lộ trình IELTS 6.5", "Giải thích thì hiện tại hoàn thành", "Sửa bài viết Task 2", "Từ vựng chủ đề môi trường"].map((title, index) => (
              <Button key={title} type="button" variant="ghost" className={`h-auto w-full justify-start rounded-xl px-3 py-2.5 text-left text-sm font-medium ${index === 0 ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"}`}>
                <MessageSquareText size={15} className="shrink-0" /><span className="truncate">{title}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
        <div className="mt-4 rounded-xl border border-border bg-white p-3">
          <div className="flex items-center gap-2 text-xs font-semibold"><Sparkles size={14} className="text-primary" /> Mẹo sử dụng AI</div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">Nêu rõ môn học, mục tiêu và phần bạn chưa hiểu để nhận câu trả lời tốt hơn.</p>
        </div>
      </aside>

      <section className="flex min-w-0 flex-col bg-white" aria-label="Trò chuyện với Brainsy AI">
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary"><Bot size={19} /></span>
            <div>
              <p className="text-sm font-bold">Brainsy AI</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground"><span className="size-1.5 rounded-full bg-emerald-500" /> Sẵn sàng hỗ trợ</p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="icon" className="size-9 rounded-xl text-muted-foreground" aria-label="Tùy chọn cuộc trò chuyện"><Menu size={18} /></Button>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          {messages.length === 0 ? (
            <div className="mx-auto flex min-h-[540px] max-w-2xl flex-col items-center justify-center px-8 text-center">
              <span className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-500 text-white shadow-lg shadow-indigo-200"><Sparkles size={27} /></span>
              <div role="heading" aria-level={1} className="mt-5 text-2xl font-bold tracking-tight">Hôm nay bạn muốn học gì?</div>
              <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">Đặt câu hỏi, gửi bài tập hoặc yêu cầu Brainsy AI tạo một kế hoạch học phù hợp với bạn.</p>
              <div className="mt-7 grid w-full grid-cols-2 gap-3">
                {suggestedPrompts.map(prompt => (
                  <Button key={prompt} type="button" variant="outline" onClick={() => send(prompt)} className="h-auto min-h-14 justify-start whitespace-normal rounded-xl px-4 py-3 text-left text-sm font-medium leading-5 hover:border-primary/30 hover:bg-secondary">
                    <Lightbulb size={16} className="shrink-0 text-primary" /> {prompt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-3xl space-y-7 px-8 py-7">
              {messages.map(message => (
                <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "assistant" && <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"><Bot size={18} /></span>}
                  <div className={`max-w-[82%] ${message.role === "user" ? "order-first" : ""}`}>
                    <div className={`rounded-2xl px-4 py-3.5 text-[15px] leading-7 ${message.role === "user" ? "rounded-tr-md bg-primary text-white" : message.error ? "rounded-tl-md border border-red-200 bg-red-50 text-red-800" : "rounded-tl-md border border-border bg-slate-50 text-foreground"}`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.role === "assistant" && !message.error && (
                        <div className="mt-4 space-y-3 border-t border-slate-200 pt-3">
                          <p className="font-bold">Ba bước nên làm:</p>
                          <ol className="list-decimal space-y-1 pl-5">
                            <li>Đọc kỹ yêu cầu và gạch chân từ khóa.</li>
                            <li>Áp dụng kiến thức nền vào từng phần nhỏ.</li>
                            <li>Kiểm tra lại kết quả bằng một cách khác.</li>
                          </ol>
                          <div className="rounded-xl bg-slate-900 px-4 py-3 font-mono text-sm text-slate-100">Kết quả = Kiến thức nền + Thực hành có phản hồi</div>
                        </div>
                      )}
                    </div>
                    {message.role === "assistant" && (
                      <div className="mt-2 flex items-center gap-1">
                        {message.error ? (
                          <Button type="button" variant="ghost" onClick={() => retry(message.id)} className="h-8 rounded-lg px-2 text-xs font-semibold text-red-700 hover:bg-red-50"><RefreshCw size={13} /> Thử lại</Button>
                        ) : (
                          <>
                            <Button type="button" variant="ghost" size="icon" onClick={() => navigator.clipboard?.writeText(message.content)} className="size-8 rounded-lg text-muted-foreground" aria-label="Sao chép câu trả lời"><Copy size={14} /></Button>
                            <Button type="button" variant="ghost" size="icon" onClick={() => retry(message.id)} className="size-8 rounded-lg text-muted-foreground" aria-label="Tạo lại câu trả lời"><RefreshCw size={14} /></Button>
                            <span className="mx-1 h-4 w-px bg-border" />
                            <Button type="button" variant="ghost" size="icon" onClick={() => setFeedback(current => ({ ...current, [message.id]: "up" }))} className={`size-8 rounded-lg ${feedback[message.id] === "up" ? "bg-emerald-50 text-emerald-600" : "text-muted-foreground"}`} aria-label="Câu trả lời hữu ích"><ThumbsUp size={14} /></Button>
                            <Button type="button" variant="ghost" size="icon" onClick={() => setFeedback(current => ({ ...current, [message.id]: "down" }))} className={`size-8 rounded-lg ${feedback[message.id] === "down" ? "bg-red-50 text-red-600" : "text-muted-foreground"}`} aria-label="Câu trả lời chưa hữu ích"><ThumbsDown size={14} /></Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {message.role === "user" && <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">NA</span>}
                </div>
              ))}
              {typing && (
                <div className="flex items-center gap-3" aria-live="polite">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary"><Bot size={18} /></span>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-border bg-slate-50 px-4 py-4">
                    <span className="size-2 animate-pulse rounded-full bg-primary/40" />
                    <span className="size-2 animate-pulse rounded-full bg-primary/60 [animation-delay:150ms]" />
                    <span className="size-2 animate-pulse rounded-full bg-primary [animation-delay:300ms]" />
                    <span className="sr-only">Brainsy AI đang trả lời</span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </ScrollArea>

        <div className="border-t border-border bg-white px-6 py-4">
          <div className="mx-auto max-w-3xl">
            {attachment && (
              <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-primary">
                <FileText size={13} /> {attachment}
                <Button type="button" variant="ghost" size="icon" onClick={() => setAttachment("")} className="size-5 rounded-md text-primary" aria-label="Xóa tệp đính kèm"><X size={12} /></Button>
              </div>
            )}
            <div className="flex items-end gap-2 rounded-2xl border border-border bg-white p-2 shadow-sm focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
              <Input id="chat-file-input" type="file" className="hidden" onChange={event => setAttachment(event.target.files?.[0]?.name ?? "")} aria-label="Chọn tệp đính kèm" />
              <Button type="button" variant="ghost" size="icon" onClick={() => document.getElementById("chat-file-input")?.click()} className="size-10 shrink-0 rounded-xl text-muted-foreground" aria-label="Đính kèm tệp"><Paperclip size={18} /></Button>
              <Textarea
                value={input}
                onChange={event => setInput(event.target.value)}
                onKeyDown={(event: KeyboardEvent<HTMLTextAreaElement>) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    send();
                  }
                }}
                placeholder="Nhập câu hỏi của bạn..."
                className="max-h-32 min-h-10 resize-none border-0 bg-transparent px-1 py-2.5 text-base shadow-none focus-visible:ring-0"
                aria-label="Tin nhắn cho Brainsy AI"
              />
              <Button type="button" size="icon" onClick={() => send()} disabled={!input.trim() || typing} className="size-10 shrink-0 rounded-xl shadow-none" aria-label="Gửi tin nhắn"><Send size={17} /></Button>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">Enter để gửi · Shift + Enter để xuống dòng · AI có thể mắc lỗi, hãy kiểm tra thông tin quan trọng</p>
          </div>
        </div>
      </section>

      <aside className="min-h-0 border-l border-border bg-slate-50/70 p-5">
        <div className="flex items-center gap-2">
          <Link2 size={17} className="text-primary" />
          <p className="text-sm font-bold">Nguồn tham khảo</p>
        </div>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">Tài liệu liên quan giúp bạn kiểm chứng và học sâu hơn.</p>
        <div className="mt-5 space-y-3">
          {[
            { title: "Ngữ pháp tiếng Anh THPT", source: "Thư viện Brainsy · Trang 18–24", icon: FileText },
            { title: "Chiến lược tự học hiệu quả", source: "Cẩm nang học tập · 8 phút đọc", icon: Lightbulb },
            { title: "Bài tập luyện tập liên quan", source: "12 câu · Có đáp án", icon: Clipboard },
          ].map(({ title, source, icon: Icon }, index) => (
            <Button key={title} type="button" variant="ghost" className="h-auto w-full items-start justify-start whitespace-normal rounded-xl border border-border bg-white p-3 text-left hover:border-primary/30 hover:bg-white">
              <span className="mr-2.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary"><Icon size={15} /></span>
              <span>
                <span className="block text-xs font-bold leading-5 text-foreground"><span className="mr-1 text-primary">[{index + 1}]</span>{title}</span>
                <span className="mt-1 block text-[11px] font-normal leading-4 text-muted-foreground">{source}</span>
              </span>
            </Button>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
          <p className="text-xs font-bold text-indigo-900">Câu hỏi liên quan</p>
          <div className="mt-3 space-y-2">
            {["Cho mình một ví dụ cụ thể", "Tạo bài tập tương tự", "Giải thích ngắn gọn hơn"].map(question => (
              <Button key={question} type="button" variant="ghost" className="h-auto w-full justify-between whitespace-normal rounded-lg bg-white/70 px-3 py-2 text-left text-xs font-medium text-indigo-800 hover:bg-white">
                {question}<ChevronRight size={13} className="shrink-0" />
              </Button>
            ))}
          </div>
        </div>
      </aside>
    </main>
  );
}

function ResourcesScreen({ openChat }: { openChat: (prompt: string) => void }) {
  const [filter, setFilter] = useState<ResourceType>("Tất cả");
  const [search, setSearch] = useState("");
  const filtered = resources.filter(resource =>
    (filter === "Tất cả" || resource.type === filter) &&
    `${resource.title} ${resource.description}`.toLocaleLowerCase("vi-VN").includes(search.toLocaleLowerCase("vi-VN"))
  );

  return (
    <main className="mx-auto max-w-[1440px] px-8 py-8">
      <div className="flex items-end justify-between gap-8">
        <PageTitle eyebrow="Thư viện học tập" title="Tìm tài liệu phù hợp với mục tiêu của bạn" description="Tài liệu, bài tập và lộ trình đã được chọn lọc để bạn học hiệu quả hơn." />
        <div className="relative w-80 shrink-0">
          <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Tìm tài liệu, chủ đề..." className="h-11 rounded-xl bg-white pl-10 text-sm" aria-label="Tìm kiếm trong thư viện" />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-b border-border pb-4">
        <div className="flex gap-2">
          {(["Tất cả", "Tài liệu", "Bài tập", "Lộ trình"] as ResourceType[]).map(item => (
            <Button key={item} type="button" variant={filter === item ? "default" : "outline"} onClick={() => setFilter(item)} className="h-9 rounded-xl px-4 text-sm font-semibold shadow-none">{item}</Button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground"><span className="font-bold text-foreground">{filtered.length}</span> kết quả phù hợp</p>
      </div>

      <div className="grid grid-cols-3 gap-5 py-6">
        {filtered.map(({ id, icon: Icon, type, title, description, meta, tone }) => (
          <article key={id} className="flex min-h-64 flex-col rounded-2xl border border-border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <span className={`flex size-11 items-center justify-center rounded-xl ${tone}`}><Icon size={20} /></span>
              <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">{type}</span>
            </div>
            <div role="heading" aria-level={2} className="mt-5 text-lg font-bold leading-7">{title}</div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
            <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
              <span className="text-xs font-medium text-muted-foreground">{meta}</span>
              <Button type="button" variant="ghost" onClick={() => openChat(`Giúp mình học tài liệu: ${title}`)} className="h-8 rounded-lg px-2 text-xs font-semibold text-primary">Học cùng AI <ArrowRight size={13} /></Button>
            </div>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-white py-16 text-center">
          <FolderOpen size={32} className="text-slate-300" />
          <p className="mt-3 font-bold">Chưa tìm thấy tài liệu phù hợp</p>
          <p className="mt-1 text-sm text-muted-foreground">Hãy thử từ khóa khác hoặc chọn lại bộ lọc.</p>
        </div>
      )}
    </main>
  );
}

function ProfileScreen() {
  return (
    <main className="mx-auto max-w-[1200px] px-8 py-8">
      <PageTitle eyebrow="Tiến độ học tập" title="Chào Nguyễn An, bạn đang tiến bộ rất tốt" description="Theo dõi mục tiêu, hoạt động gần đây và duy trì nhịp học đều đặn." />
      <div className="mt-8 grid grid-cols-12 gap-5">
        <section className="col-span-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <SectionHeading title="Mục tiêu tuần này" description="11–17 tháng 8" action={<span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Đúng tiến độ</span>} />
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Thời gian học", value: "4 giờ 20 phút", target: "Mục tiêu 5 giờ", icon: Clock3, progress: "w-[86%]", tone: "text-primary bg-secondary" },
              { label: "Bài đã hoàn thành", value: "12 bài", target: "Mục tiêu 15 bài", icon: CheckCircle2, progress: "w-4/5", tone: "text-emerald-600 bg-emerald-50" },
              { label: "Chuỗi học liên tục", value: "7 ngày", target: "Kỷ lục 12 ngày", icon: Trophy, progress: "w-7/12", tone: "text-amber-600 bg-amber-50" },
            ].map(({ label, value, target, icon: Icon, progress, tone }) => (
              <div key={label} className="rounded-xl border border-border p-4">
                <span className={`flex size-9 items-center justify-center rounded-xl ${tone}`}><Icon size={17} /></span>
                <p className="mt-4 text-xs font-medium text-muted-foreground">{label}</p>
                <p className="mt-1 text-lg font-bold">{value}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full bg-primary ${progress}`} /></div>
                <p className="mt-2 text-[11px] text-muted-foreground">{target}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="col-span-4 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-full bg-slate-900 text-base font-bold text-white">NA</span>
            <div>
              <p className="text-lg font-bold">Nguyễn An</p>
              <p className="mt-1 text-sm text-muted-foreground">Học viên · Lớp 12</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-3 text-center"><p className="text-lg font-bold">1.280</p><p className="mt-1 text-[11px] text-muted-foreground">Điểm học tập</p></div>
            <div className="rounded-xl bg-slate-50 p-3 text-center"><p className="text-lg font-bold">B1+</p><p className="mt-1 text-[11px] text-muted-foreground">Trình độ hiện tại</p></div>
          </div>
          <Button type="button" variant="outline" className="mt-4 h-10 w-full rounded-xl text-sm font-semibold"><Settings size={16} /> Chỉnh sửa hồ sơ</Button>
        </aside>

        <section className="col-span-8 rounded-2xl border border-border bg-white p-6 shadow-sm">
          <SectionHeading title="Hoạt động gần đây" description="Những nội dung bạn vừa học" />
          <div className="space-y-1">
            {[
              { title: "Hoàn thành bài luyện đọc hiểu B1", time: "Hôm nay, 10:24", icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-600" },
              { title: "Hỏi Brainsy AI về thì hiện tại hoàn thành", time: "Hôm qua, 20:15", icon: Bot, tone: "bg-indigo-50 text-primary" },
              { title: "Lưu tài liệu 300 từ vựng học thuật", time: "12 tháng 8, 16:40", icon: BookOpen, tone: "bg-sky-50 text-sky-600" },
            ].map(({ title, time, icon: Icon, tone }) => (
              <div key={title} className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50">
                <span className={`flex size-9 items-center justify-center rounded-xl ${tone}`}><Icon size={16} /></span>
                <div className="flex-1"><p className="text-sm font-semibold">{title}</p><p className="mt-1 text-xs text-muted-foreground">{time}</p></div>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            ))}
          </div>
        </section>

        <aside className="col-span-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-500 p-6 text-white shadow-sm">
          <Sparkles size={22} />
          <p className="mt-8 text-lg font-bold">Bạn còn một bước nhỏ</p>
          <p className="mt-2 text-sm leading-6 text-indigo-100">Hoàn thành 20 phút luyện nghe để đạt mục tiêu tuần này.</p>
          <Button type="button" className="mt-5 h-10 w-full rounded-xl bg-white text-sm font-semibold text-indigo-700 shadow-none hover:bg-indigo-50">Tiếp tục học <ArrowRight size={15} /></Button>
        </aside>
      </div>
    </main>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem(AUTH_STORAGE_KEY) === "true" || sessionStorage.getItem(AUTH_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [view, setView] = useState<View>("home");
  const [chatPrompt, setChatPrompt] = useState("");

  const handleLogin = (remember: boolean) => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      (remember ? localStorage : sessionStorage).setItem(AUTH_STORAGE_KEY, "true");
    } catch {
      // Keep the demo session available when browser storage is blocked.
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Logging out still succeeds in memory.
    }
    setView("home");
    setIsAuthenticated(false);
  };

  const navigate = (nextView: View) => {
    if (nextView === "chat") setChatPrompt("");
    setView(nextView);
  };

  const openChat = (prompt: string) => {
    setChatPrompt(prompt);
    setView("chat");
  };

  if (!isAuthenticated) {
    return (
      <LoginScreen
        wordmark={<BrainsyWordmark className="grid h-8 w-40 flex-row-reverse justify-center font-bold not-italic text-foreground shadow-none [font-family:Inter,sans-serif] [&>span]:font-bold [&>span]:not-italic [&>span]:shadow-none" />}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader view={view} setView={navigate} onLogout={handleLogout} />
      {view === "home" && <HomeScreen setView={navigate} askAI={openChat} />}
      {view === "chat" && <ChatScreen initialPrompt={chatPrompt} />}
      {view === "resources" && <ResourcesScreen openChat={openChat} />}
      {view === "profile" && <ProfileScreen />}
    </div>
  );
}
