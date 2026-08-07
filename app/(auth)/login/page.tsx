"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Building2, ArrowRight, ShieldCheck, UserCircle, KeyRound, Smartphone } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppStore();
  
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  
  // State for form
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !password) return;
    setIsLoading(true);
    setError("");
    
    setTimeout(() => {
      setIsLoading(false);
      // Validate mock users
      if ((employeeId === 'SUP001' || employeeId === 'SAL001') && password === 'password123') {
        setStep('otp');
      } else {
        setError("Invalid employee credentials");
      }
    }, 600);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      setIsLoading(false);
      if (otp === '123456') {
        // Successful login
        login({
          id: employeeId,
          name: employeeId === 'SUP001' ? 'Sanjay Verma' : 'Rohan Sharma',
          role: 'Employee',
          email: `${employeeId.toLowerCase()}@knightfrank.com`,
          avatar: `https://i.pravatar.cc/150?u=${employeeId}`
        });
        router.push('/select-workspace');
      } else {
        setError("Invalid verification code");
      }
    }, 600);
  };

  const renderCredentialsStep = () => (
    <form onSubmit={handleCredentialsSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Employee ID</label>
          <div className="relative">
            <UserCircle className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <Input 
              type="text" 
              placeholder="e.g. SUP001" 
              className={`pl-10 h-11 border-slate-200 bg-slate-50 focus:bg-white transition-colors ${error ? 'border-red-300 ring-1 ring-red-200' : ''}`} 
              value={employeeId}
              onChange={(e) => { setEmployeeId(e.target.value); setError(""); }}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Password</label>
            <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Forgot?</a>
          </div>
          <div className="relative">
            <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <Input 
              type="password" 
              placeholder="••••••••" 
              className={`pl-10 h-11 border-slate-200 bg-slate-50 focus:bg-white transition-colors ${error ? 'border-red-300 ring-1 ring-red-200' : ''}`} 
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              required
            />
          </div>
        </div>
      </div>
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      <button type="submit" className="w-full h-11 font-semibold text-base inline-flex items-center justify-center rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors" disabled={isLoading || !employeeId || !password}>
        {isLoading ? "Authenticating..." : "Continue"} <ArrowRight className="h-4 w-4 ml-2" />
      </button>
    </form>
  );

  const renderOtpStep = () => (
    <form onSubmit={handleOtpSubmit} className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-start gap-3 mb-2">
        <Smartphone className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
        <p className="text-sm text-indigo-900 font-medium leading-relaxed">
          We sent a verification code to your registered mobile number ending in <span className="font-bold">***10</span>.
        </p>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 text-center block">Verify your identity</label>
        <Input 
          type="text" 
          placeholder="000000" 
          maxLength={6}
          className={`h-14 text-center text-2xl font-bold tracking-[0.5em] border-slate-200 bg-slate-50 focus:bg-white transition-colors ${error ? 'border-red-300 ring-1 ring-red-200' : ''}`} 
          value={otp}
          onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); setError(""); }}
          required
          autoFocus
        />
      </div>
      {error && <p className="text-sm font-medium text-red-600 text-center">{error}</p>}
      <button type="submit" className="w-full h-11 font-semibold text-base inline-flex items-center justify-center rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors" disabled={isLoading || otp.length < 6}>
        {isLoading ? "Verifying..." : "Verify"} <ShieldCheck className="h-4 w-4 ml-2" />
      </button>
      <div className="text-center flex justify-between">
        <button type="button" onClick={() => { setStep('credentials'); setOtp(""); setError(""); }} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          Back to Login
        </button>
        <button type="button" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
          Resend Code
        </button>
      </div>
    </form>
  );

  return (
    <div className="w-full flex items-center justify-center p-4 min-h-screen bg-slate-50">
      <div className="w-full max-w-md">
        
        {/* LOGO AREA */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-display tracking-tight">Estate OS</h1>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-1">Enterprise Login</p>
        </div>

        <Card className="w-full border-slate-200/60 shadow-xl rounded-2xl overflow-hidden bg-white/90 backdrop-blur">
          <CardHeader className="text-center pb-2 pt-8">
            <CardTitle className="text-xl">
              {step === 'credentials' ? "Welcome Back" : "Two-Factor Authentication"}
            </CardTitle>
            <CardDescription className="text-slate-500 mt-1">
              {step === 'credentials' ? "Sign in with your employee credentials." : "Verify your identity to proceed."}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 pt-6">
            {step === 'credentials' ? renderCredentialsStep() : renderOtpStep()}
          </CardContent>

          {step === 'credentials' && (
            <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 justify-center">
              <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Secure Internal Portal
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
