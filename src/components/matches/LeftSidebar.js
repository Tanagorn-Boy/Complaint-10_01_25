import { GoHeartFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";

export default function LeftSidebar() {
  const SidebarChat = ({ sender, message, img }) => {
    return (
      <button className="flex items-center gap-4 px-3">
        <div className="flex size-14 overflow-hidden rounded-full">
          <img src={img} alt="" className="h-full w-full object-cover" />
        </div>

        <div className="text-start">
          <p className="text-sm text-fourth-900">{sender}</p>
          <p className="text-xs text-fourth-700">{message}</p>
        </div>
      </button>
    );
  };

  return (
    <aside className="hidden min-w-[17.5rem] border-r-2 border-fourth-300 bg-utility-primary lg:inline">
      <div className="px-4 py-7">
        <button className="flex w-full flex-col items-center gap-4 rounded-xl border border-second-500 bg-fourth-100 px-3 py-6">
          <figure className="relative">
            <GoHeartFill className="size-10 text-primary-400" />
            <FiSearch className="absolute -bottom-1 -right-3 size-9 text-primary-600" />
          </figure>

          <div>
            <p className="text-xl font-bold text-primary-600">
              Discover New Match
            </p>
            <p className="text-center text-xs text-fourth-700">
              Start find and Merry to get know <br /> and connect with new
              friend!
            </p>
          </div>
        </button>
      </div>

      <div className="h-[2px] w-full bg-fourth-300"></div>

      <div className="flex flex-col gap-10 px-4 py-7">
        {/* Merry Match! carousel*/}
        <div className="flex flex-col gap-3">
          <p className="text-xl font-bold text-fourth-900">Merry Match!</p>
          {/* Carousel */}
          <div className="flex gap-3">
            <div className="flex size-[5rem] overflow-hidden rounded-2xl">
              <img
                src="/images/matching-page/matches_01.png"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex size-[5rem] overflow-hidden rounded-2xl">
              <img
                src="/images/matching-page/matches_02.png"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Chat with Merry Match */}
        <div className="flex flex-col gap-7">
          <p className="text-xl font-bold text-fourth-900">
            Chat with Merry Match
          </p>

          {/* Chat */}
          <div className="flex flex-col gap-7">
            {/* 1 */}
            <SidebarChat
              sender="Daeny"
              message="You: hi"
              img="/images/matching-page/matches_01.png"
            />

            {/* 2 */}
            <SidebarChat
              sender="Ygritte"
              message="You know nothing Jon Snow"
              img="/images/matching-page/matches_02.png"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
