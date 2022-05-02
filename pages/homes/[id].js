import Image from "next/image";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";

import { PrismaClient } from "@prisma/client";

// Instantiate Prisma Client
const prisma = new PrismaClient();

const ListedHome = (home = null) => {
  const router = useRouter();

  // Fallback version
  if (router.isFallback) {
    return "Loading...";
  }

  console.log(home.image);
  return (
    <Layout>
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4 space-y-4">
          <div>
            <h1 className="text-2xl font-semibold truncate">
              {home?.title ?? ""}
            </h1>
            <ol className="inline-flex items-center space-x-1 text-gray-500">
              <li>
                <span>{home?.guests ?? 0} guests</span>
                <span aria-hidden="true"> · </span>
              </li>
              <li>
                <span>{home?.beds ?? 0} beds</span>
                <span aria-hidden="true"> · </span>
              </li>
              <li>
                <span>{home?.baths ?? 0} baths</span>
              </li>
            </ol>
          </div>
        </div>
        {home?.image && (
          <div className="mt-6 relative aspect-video bg-gray-200 h-[500px] rounded-lg shadow-md overflow-hidden">
            <Image
              src={home.image}
              alt={home.title}
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
        <p className="mt-8 text-lg">{home?.description ?? ""}</p>
      </div>
    </Layout>
  );
};

export default ListedHome;

export async function getStaticPaths() {
  // Get all the homes IDs from the database
  const homes = await prisma.home.findMany({
    select: { id: true },
  });

  return {
    paths: homes.map((home) => ({
      params: { id: home.id },
    })),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  // Get the current home from the database
  const home = await prisma.home.findUnique({
    where: { id: params.id },
  });

  if (home) {
    return {
      props: JSON.parse(JSON.stringify(home)),
    };
  }

  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
}
