import Image from "next/image";
import type { CastMember } from "@/types/media";
import { imageUrl } from "@/lib/utils";

interface CastRowProps {
  cast: CastMember[];
}

export function CastRow({ cast }: CastRowProps) {
  if (cast.length === 0) return null;

  return (
    <section className="py-6">
      <h2 className="mb-4 px-4 font-display text-xl font-bold text-white sm:px-0">
        В ролях
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {cast.map((person) => (
          <div key={person.id} className="w-24 shrink-0 text-center sm:w-28">
            <div className="relative mx-auto aspect-square w-20 overflow-hidden rounded-full bg-zinc-800 sm:w-24">
              <Image
                src={
                  person.profile_path
                    ? imageUrl(person.profile_path, "w342")
                    : "/placeholder-poster.svg"
                }
                alt={person.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <p className="mt-2 line-clamp-2 text-xs font-medium text-white">
              {person.name}
            </p>
            <p className="line-clamp-1 text-[10px] text-zinc-500">
              {person.character}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
