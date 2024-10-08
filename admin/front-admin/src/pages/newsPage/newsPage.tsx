import { useLoaderData, useNavigate } from "react-router-dom";
import callApi from "../../api/api";
import CustomizedTables from "../../components/newsTable/newsTable";
import SpotsCount from "../../components/spotsCount/spotsCount";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import { getAuth } from "../../util/get-auth";
import { ChangeEvent, useEffect, useState } from "react";
import { Backdrop, CircularProgress, Fab, Pagination } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";

const NewsPage = () => {
  const navigate = useNavigate();
  const user = getAuth();
  const [newsCount, setNewsCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [authorized, setAuthorized] = useState(false);
  const [stats, setStats] = useState<any>({});
  const handleChange = (e: ChangeEvent<unknown>, value: number) => {
    setPage(value);
    navigate(`/dashboard/novosti/${value}`);
  };
  useEffect(() => {
    if (!user) navigate("/login");
    else setAuthorized(true);
  }, [user]);
  const fetchCount = async () => {
    const count = await callApi.News.getCount();
    setNewsCount(count);
  };
  useEffect(() => {
    fetchCount();
  }, []);
  const tableData = useLoaderData() as any;
  useEffect(() => {
    const fetchStats = async () => {
      const response = await callApi.TouristSpots.getCounts();
      setStats(response);
    };
    fetchStats();
  }, []);
  return authorized ? (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={user === "ADMIN" ? 4 : 6}>
            <SpotsCount
              title={"Broj turističkih mjesta"}
              number={stats.spots}
            />
          </Grid>
          <Grid xs={12} sm={user === "ADMIN" ? 4 : 6}>
            <SpotsCount title="Broj novosti" number={stats.news} />
          </Grid>
          {user === "ADMIN" && (
            <Grid xs={12} sm={4}>
              <SpotsCount
                title="Broj korisničkih naloga"
                number={stats.users}
              />
            </Grid>
          )}
          <Grid xs={3} md={12} overflow={"scroll"} width={"100%"}>
            <CustomizedTables data={tableData} />
          </Grid>
          <Grid
            xs={12}
            justifyContent={"center"}
            alignItems={"center"}
            width={"100%"}
            overflow={"auto"}
          >
            <Pagination
              count={Math.ceil(newsCount / limit)}
              onChange={handleChange}
            ></Pagination>
          </Grid>
        </Grid>
      </Box>
      <Link to={"../dodajNovost"}>
        <Fab
          variant="extended"
          sx={{ position: "fixed", bottom: "3%", right: "1%" }}
        >
          <AddIcon sx={{ mr: 1 }} />
          Dodaj Novost
        </Fab>
      </Link>
    </>
  ) : (
    <Backdrop
      open
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default NewsPage;
