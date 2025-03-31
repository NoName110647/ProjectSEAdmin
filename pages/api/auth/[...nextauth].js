import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,  // เพิ่ม secret ให้ NextAuth
  pages: {
    signIn: '/auth/signin',   // กำหนด URL สำหรับหน้าล็อกอิน
    error: '/auth/error',     // กำหนด URL สำหรับหน้าข้อผิดพลาด
  },
});
