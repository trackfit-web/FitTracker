import { useState, useRef } from "react";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";
import PlayAudio from "../../assets/play.mp3"

const Header = () => {
  const [isPlaying, setIsPlaying] = useState(false); // State to track whether audio is playing
  const audioRef = useRef(new Audio("/play.mp3")); // Reference to the audio element
  console.log(audioRef);
  const role = localStorage.getItem("userRole");

  // Toggle play/pause functionality
  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause(); // Pause the audio
    } else {
      audioRef.current.play(); // Play the audio
    }
    setIsPlaying(!isPlaying); // Toggle the play/pause state
  };

  return (
    <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <button
            aria-label="side-bar"
            aria-controls="sidebar"
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              {/* Menu icon */}
            </span>
          </button>
        </div>

        <div className="hidden sm:block"></div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          {/* Play/Pause Button using Ionicons */}
          <button
          onClick={toggleAudio}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          className="flex items-center gap-2 p-2 bg-red-800 hover:bg-red-400 text-white rounded-full transition-colors duration-200"
        >
          {/* Play or Pause icon */}
          {isPlaying ? (
            <ion-icon name="pause" class="text-xl"></ion-icon>
          ) : (
            <ion-icon name="play" class="text-xl"></ion-icon>
          )}
        </button>
        
          <ul className="flex items-center gap-2 2xsm:gap-4">
            <li>{role === "user" && <DropdownNotification />}</li>
          </ul>

          <DropdownUser />
        </div>
      </div>
    </header>
  );
};

export default Header;
