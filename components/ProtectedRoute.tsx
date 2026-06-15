"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function ProtectedRoute({

  children,

  allowedRoles,

}: {

  children: React.ReactNode;

  allowedRoles: string[];

}) {

  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    checkAccess();

  }, []);

  async function checkAccess() {

    /* GET LOGGED IN USER */

    const {
      data: authData,
    } = await supabase.auth.getUser();

    const email =
      authData?.user?.email;

    if (!email) {

      router.push("/login");

      return;
    }

    /* GET ROLE */

    const {
      data,
    } = await supabase

      .from("users")

      .select("role")

      .eq("email", email);

    const role =
      data?.[0]?.role;

    /* CHECK ACCESS */

    if (
      !allowedRoles.includes(role)
    ) {

      router.push("/unauthorized");

      return;
    }

    setLoading(false);
  }

  if (loading) {

    return (

      <div className="h-screen flex items-center justify-center">

        <h1 className="text-2xl font-bold">

          Checking Access...

        </h1>

      </div>
    );
  }

  return <>{children}</>;
}