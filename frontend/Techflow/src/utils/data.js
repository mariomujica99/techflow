import {
  LuUser,
  LuUsers,
  LuLogOut,
} from "react-icons/lu";
import { FaComputer } from "react-icons/fa6";
import { FaUserMd } from "react-icons/fa";
import { TbChalkboard } from "react-icons/tb";
import { BsCartPlus } from "react-icons/bs";
import { PiFiles } from "react-icons/pi";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Whiteboard",
    icon: TbChalkboard,
    path: "/admin/whiteboard",
  },
  {
    id: "02",
    label: "Needed Supplies",
    icon: BsCartPlus,
    path: "/admin/supplies",
  },
  {
    id: "03",
    label: "Computer Stations",
    icon: FaComputer,
    path: "/admin/com-stations",
  },
  {
    id: "04",
    label: "Files",
    icon: PiFiles,
    path: "/admin/files",
  },
  {
    id: "05",
    label: "Team Members",
    icon: LuUsers,
    path: "/admin/users",
  },
  {
    id: "06",
    label: "Reading Providers",
    icon: FaUserMd,
    path: "/admin/providers",
  },
  {
    id: "07",
    label: "Edit Profile",
    icon: LuUser,
    path: "/admin/edit-profile",
  },
  {
    id: "08",
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  },
];

export const SIDE_MENU_USER_DATA = [
  {
    id: "01",
    label: "Whiteboard",
    icon: TbChalkboard,
    path: "/user/whiteboard",
  },
  {
    id: "02",
    label: "Needed Supplies",
    icon: BsCartPlus,
    path: "/user/supplies",
  },
  {
    id: "03",
    label: "Computer Stations",
    icon: FaComputer,
    path: "/user/com-stations",
  },
  {
    id: "04",
    label: "Files",
    icon: PiFiles,
    path: "/user/files",
  },
  {
    id: "05",
    label: "Team Members",
    icon: LuUsers,
    path: "/user/users",
  },
  {
    id: "06",
    label: "Reading Providers",
    icon: FaUserMd,
    path: "/user/providers",
  },
  {
    id: "07",
    label: "Edit Profile",
    icon: LuUser,
    path: "/user/edit-profile",
  },
  {
    id: "08",
    label: "Logout",
    icon: LuLogOut,
    path: "logout",
  },
];

export const COM_STATIONS_DROPDOWN_OPTIONS = [
  { label: "All Computer Stations", value: "All Computer Stations" },
  { label: "All Inactive Stations", value: "All Inactive Stations" },
  { label: "EMU Stations", value: "EMU Station" },
  { label: "Carts (All)", value: "EEG Cart - All" },
  { label: "Carts (Inpatient)", value: "EEG Cart - Inpatient" },
  { label: "Carts (Outpatient)", value: "EEG Cart - Outpatient" },
  { label: "Carts (Bellevue)", value: "EEG Cart - Bellevue" },
];

export const SUPPLIES = [
  { label: "Acetone", value: "Acetone" },
  { label: "Air Hose", value: "Air Hose" },
  { label: "Alarm Button", value: "Alarm Button" },
  { label: "Bags", value: "Bags" },
  { label: "Blankets", value: "Blankets" },
  { label: "Cleaning Wipes", value: "Cleaning Wipes" },
  { label: "Coban", value: "Coban" },
  { label: "Collodion", value: "Collodion" },
  { label: "Collodion Remover", value: "Collodion Remover" },
  { label: "Conductive Paste", value: "Conductive Paste" },
  { label: "Cotton Balls", value: "Cotton Balls" },
  { label: "Cotton Tips", value: "Cotton Tips" },
  { label: "Floor Tape", value: "Floor Tape" },
  { label: "Fitted Sheets", value: "Fitted Sheets" },
  { label: "Gauze Squares", value: "Gauze Squares" },
  { label: "Glue/Remover Cups", value: "Glue/Remover Cups" },
  { label: "Gray Cord", value: "Gray Cord" },
  { label: "Hair Ties", value: "Hair Ties" },
  { label: "Head Wraps", value: "Head Wraps" },
  { label: "Long Towels", value: "Long Towels" },
  { label: "Measuring Marker", value: "Measuring Marker" },
  { label: "Measuring Tape", value: "Measuring Tape" },
  { label: "Medipore", value: "Medipore" },
  { label: "Micropore", value: "Micropore" },
  { label: "MRI Leads", value: "MRI Leads" },
  { label: "Pillowcases", value: "Pillowcases" },
  { label: "Prep/Paste Cups", value: "Prep/Paste Cups" },
  { label: "Red Cord", value: "Red Cord" },
  { label: "Regular Leads", value: "Regular Leads" },
  { label: "Skin Prep", value: "Skin Prep" },
  { label: "Square Towels", value: "Square Towels" },
  { label: "Syringes", value: "Syringes" },
  { label: "Tensive", value: "Tensive" },
  { label: "Tongue Depressors", value: "Tongue Depressors" },
  { label: "Top Sheets", value: "Top Sheets" },
  { label: "Transpore", value: "Transpore" },
];