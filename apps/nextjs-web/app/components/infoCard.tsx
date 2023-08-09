import Image from "next/image";

export const InfoCard = () => {
  return (
    <div className="flex flex-col gap-5">
      <span className="border-b border-black">
        ich habe folgende Informationen für Sie gefunden:
      </span>
      <div className="flex justify-between">
        <div className="flex gap-2 items-center">
          <span className="font-bold text-lg">Urlaubsgeld</span>
          <div className="border border-black rounded-md px-6 bg-slate-100">
            draft
          </div>
          <div className="border border-black rounded-md px-6 bg-slate-100">
            published
          </div>
        </div>
        <div className="flex gap-4">
          <Image
            src="/thumbs-up.svg"
            alt="Thumbs Up"
            className="dark:invert"
            width={24}
            height={24}
            priority
          />
          <Image
            src="/thumbs-down-outline.svg"
            alt="Thumbs Down outline"
            className="dark:invert"
            width={24}
            height={24}
            priority
          />
        </div>
      </div>

      <div>
        <span>
          Die Springfield AG gewährte in den vergangenen Jahren regelmäßig
          Urlaubsgeld. Einen Antrag dazu müssen Sie nicht stellen.
        </span>
      </div>
      <div>
        <span>Quelle: </span>
        <a
          className="text-blue-500"
          href="http//intranet.springfield-ag.com/personal/urlaub"
          target="_blank"
        >
          http//intranet.springfield-ag.com/personal/urlaub
        </a>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="border border-black rounded-md px-6 bg-slate-100">
            Personal
          </div>
          <div className="border border-black rounded-md px-6 bg-slate-100">
            Allgemeines
          </div>
          <div className="border border-black rounded-md px-6 bg-slate-100">
            Urlaub
          </div>
        </div>
        <button className="border border-black rounded-md px-6 text-xl bg-slate-100">
          Details...
        </button>
      </div>
    </div>
  );
};
