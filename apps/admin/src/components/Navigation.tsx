import { FormatListBulleted, Settings } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Navigation: React.FC = () => {
  const [page, setPage] = useState("/home");
  const navigate = useNavigate();

  useEffect(() => {
    navigate(page);
  }, [page]);

  return (
    <div
      className="position-absolute w-100"
      style={{ left: "50%", bottom: 0, transform: "translate(-50%)" }}
    >
      <BottomNavigation
        showLabels={true}
        value={page}
        onChange={(event, newValue) => {
          setPage(newValue);
        }}
      >
        <BottomNavigationAction
          label="Cartes"
          value={"/home"}
          icon={<FormatListBulleted />}
        />
        <BottomNavigationAction
          label="Config"
          value={"/options"}
          icon={<Settings />}
        />
      </BottomNavigation>
    </div>
  );
};
