import clsx from "clsx";
import type { Metadata } from "next";
import type { IconType } from "react-icons";
import { MdCheck, MdErrorOutline, MdPayment, MdPerson } from "react-icons/md";

import { Api } from "@/lib";
import { apiBaseURL } from "@/config";

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: "Solana tranfer bot | Check our status page",
  description:
    "Solana transfer bot onboard hundred's of user and process thousands of transactions. Track our live progress here.",
};

export default async function StatusPage() {
  const api = new Api("https://v1.api.tekfinance.fun", "");
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  const status = await api.micellenous.getStatus().then(({ data }) => data);
  const todayStatus = await api.micellenous
    .getStatus({ timestamp__gte: date.toISOString() })
    .then(({ data }) => data);

  return (
    <main className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col space-y-4 self-center lt-md:p-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-lg font-black">All time</h1>
          <div className="flex-1 grid grid-cols-2 gap-8">
            <StatusCard
              title="Users"
              icon={MdPerson}
              up={status.user.active}
              down={status.user.inactive}
              iconClassName="bg-purple-200 text-purple-500"
            />
            <StatusCard
              title="Transactions"
              icon={MdPayment}
              up={status.tip.completed}
              down={status.tip.incomplete}
              iconClassName="bg-pink-200 text-pink-500"
            />
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <h1 className="text-lg font-black">Today</h1>
          <div className="flex-1 grid grid-cols-2 gap-8">
            <StatusCard
              title="Users"
              icon={MdPerson}
              up={todayStatus.user.active}
              down={todayStatus.user.inactive}
              iconClassName="bg-purple-200 text-purple-500"
            />
            <StatusCard
              title="Transactions"
              icon={MdPayment}
              up={todayStatus.tip.completed}
              down={todayStatus.tip.incomplete}
              iconClassName="bg-pink-200 text-pink-500"
            />
          </div>
        </div>
      </div>
      <footer className="p-2 text-center">
        © Tekfinance, 2022. All right reserved
      </footer>
    </main>
  );
}

type StatusCardProps = {
  icon: IconType;
  title: string;
  down: number;
  up: number;
  iconClassName: string;
};

const StatusCard = ({
  title,
  up,
  down,
  iconClassName,
  ...props
}: StatusCardProps) => {
  return (
    <div className="flex flex-col space-y-4 bg-dark md:min-w-56 max-h-48 p-4 rounded-md">
      <div className="flex flex-col space-y-2">
        <div className={clsx(iconClassName, "self-start p-2 rounded-full")}>
          <props.icon className="text-xl" />
        </div>
        <p className="text-base font-bold">{title}</p>
      </div>
      <div className="flex space-x-4 items-center">
        <div className="flex-1 flex flex-col space-y-1">
          <p className="text-sm">Successful</p>
          <div className="flex space-x-2 items-center">
            <div className="p-2 bg-green-500/10 text-green-500 rounded-full">
              <MdCheck />
            </div>
            <h1 className="text-2xl font-black">{up}</h1>
          </div>
        </div>
        <div className="flex-1 flex flex-col space-y-1">
          <p className="text-sm">Failed</p>

          <div className="flex space-x-2 items-center">
            <div className="p-2 bg-red-500/10 text-red-500 rounded-full">
              <MdErrorOutline />
            </div>
            <h1 className="text-2xl font-black">{down}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};
