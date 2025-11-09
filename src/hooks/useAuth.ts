import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // 초기값을 false로 변경
  const [initializing, setInitializing] = useState(true); // 초기화 상태 분리

  useEffect(() => {
    // 현재 세션 확인
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('세션 확인 오류:', error);
          return;
        }
        
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('세션 확인 중 예외:', error);
      } finally {
        setInitializing(false); // 초기화 완료
      }
    };

    getSession();

    // 인증 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('인증 상태 변경:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('pendingSajuSave');
          sessionStorage.clear();
        } else {
          setUser(session?.user ?? null);
        }
        
        // 인증 상태 변경 시에는 loading을 false로 설정
        setLoading(false);
        setInitializing(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    // 이미 로딩 중이거나 사용자가 이미 로그인되어 있으면 중복 실행 방지
    if (loading || user) {
      console.warn('이미 로그인 진행 중이거나 로그인되어 있음');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          scopes: 'email'
        }
      });
      
      if (error) {
        console.error('OAuth 오류:', error);
        setLoading(false); // 오류 시 즉시 로딩 해제
        throw error;
      }
      
      // 성공 시에는 리다이렉트가 일어나므로 loading 상태를 유지
      // 페이지가 새로고침되면서 자연스럽게 해제됨
      
    } catch (error) {
      console.error('Google 로그인 오류:', error);
      setLoading(false); // 오류 시 로딩 상태 해제
      throw error;
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading: loading || initializing, // 로딩 중이거나 초기화 중일 때 true
    signInWithGoogle,
    signOut
  };
}