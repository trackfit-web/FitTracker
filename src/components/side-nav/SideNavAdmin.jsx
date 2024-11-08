import { NavLink } from "react-router-dom";
import Logo from "../logo/Logo";

function SideNavAdmin() {
  return (
    <aside
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 translate-x-0 bg-gray-200`}
    >
      <div className="flex items-center justify-between gap-2 px-6 pt-6 lg:py-6.5">
        <h2 className="mb-4 ml-4 text-lg font-semibold text-black">
          <Logo />
        </h2>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-black">
              MENU
            </h3>

            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <NavLink
                  to="/admin/manage-admins"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black duration-300 ease-in-out hover:bg-white dark:hover:bg-meta-4 
                    bg-graydark dark:bg-meta-4
                  `}
                >
                  <ion-icon
                    name="people-outline"
                    aria-label="admins-icon"
                  ></ion-icon>
                  Manage Admins
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/manage-workouts"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black duration-300 ease-in-out hover:bg-white dark:hover:bg-meta-4 
                    bg-graydark dark:bg-meta-4
                  `}
                >
                  <ion-icon
                    name="barbell-outline"
                    aria-label="workouts-icon"
                  ></ion-icon>
                  Manage Workouts
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/admin/manage-feedbacks"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black duration-300 ease-in-out hover:bg-white dark:hover:bg-meta-4 bg-graydark dark:bg-meta-4`}
                >
                  <ion-icon
                    name="chatbubble-outline"
                    aria-label="feedback-icon"
                  ></ion-icon>
                  Manage Feedback
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}

export default SideNavAdmin;
