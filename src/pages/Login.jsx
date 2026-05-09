import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart } from 'lucide-react';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('partner1');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, username, role);
        alert('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.');
        setLoading(false);
      } else {
        await signIn(email, password);
        // Don't navigate here - let AuthContext handle it via onAuthStateChange
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Heart className="w-16 h-16 text-primary mx-auto mb-4 fill-primary" />
          <h1 className="font-pacifico text-4xl text-primary mb-2">Our Notebook</h1>
          <p className="text-muted-foreground text-sm">Nơi lưu giữ kỷ niệm của đôi ta 💕</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl border border-border">
          <h2 className="text-2xl font-bold text-center mb-6">
            {isSignUp ? 'Tạo tài khoản' : 'Đăng nhập'}
          </h2>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground block mb-2">
                    Tên của bạn
                  </label>
                  <Input
                    type="text"
                    placeholder="Nhập tên..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-muted-foreground block mb-2">
                    Bạn là ai?
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('partner1')}
                      className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all ${
                        role === 'partner1'
                          ? 'bg-primary text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      Partner 1
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('partner2')}
                      className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all ${
                        role === 'partner2'
                          ? 'bg-primary text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      Partner 2
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-sm font-semibold text-muted-foreground block mb-2">
                Email
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-muted-foreground block mb-2">
                Mật khẩu
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl h-11"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : isSignUp ? 'Đăng ký' : 'Đăng nhập'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary font-semibold hover:underline"
            >
              {isSignUp ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
