import { logoutUser } from "@/lib/features/auth/auththunks";
import { Logout } from "@mui/icons-material";
import Popover from "@mui/material/Popover";
import Link from "next/link";
import { useDispatch } from "react-redux";

export default function AccountPopover({ anchorEl, setAnchorEl }) {
  const handleClose = () => {
    setAnchorEl(null);
  };
  const dispatch = useDispatch();

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Popover
        id={id}
        open={open}
        disableScrollLock={true}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              width: anchorEl ? anchorEl.offsetWidth : "auto",
            },
          },
        }}
      >
        <div className="flex flex-col py-2">
          <Link
            href={"/account"}
            className=" text-center text-primary hover:bg-primary hover:text-white text-lg py-2 transition-colors"
          >
            Dashboard
          </Link>
          <button
            className="text-primary hover:bg-primary hover:text-white text-lg py-2 transition-colors"
            onClick={() => {
              dispatch(logoutUser());
            }}
          >
            Log Out <Logout />
          </button>
        </div>
      </Popover>
    </div>
  );
}
