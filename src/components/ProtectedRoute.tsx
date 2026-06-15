"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

interface Props {

  children: React.ReactNode;

  allowedRoles: string[];
}

export default function ProtectedRoute({

  children,

  allowedRoles,

}: Props) {

  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    checkAccess();

  }, []);

  async function checkAccess() {

    /* GET LOGGED USER */

    const {
      data: authData,
    } = await supabase.auth.getUser();

    const email =
      authData?.user?.email;

    /* NOT LOGGED IN */

    if (!email) {

      router.push("/login");

      return;
    }

    /* GET USER ROLE */

    const {
      data,
    } = await supabase

      .from("users")

      .select("role")

      .eq("email", email);

    const role =
      data?.[0]?.role;

    /* ACCESS CHECK */

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