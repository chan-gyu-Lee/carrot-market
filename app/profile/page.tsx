import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";

async function getUser() {
  const session = await getSession();

  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    return user;
  } else {
    // session없이 페이지 이동하면 404 페이지를 보여줌
    notFound();
  }
}

export default async function Profile() {
  const user = await getUser();

  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };

  return (
    <div>
      <h1>Welcome! {user?.username}</h1>
      <form action={logOut}>
        <button>logout</button>
      </form>
    </div>
  );
}
