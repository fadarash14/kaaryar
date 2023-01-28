import {
  Button,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getData } from "../../api/axios";
import { ExcelExport } from "../../components/ExcelExport";
import LoadingProgress from "../../components/LoadingProgress";
import SearchAll from "../../components/search/SearchAll";
import TableBodyAll from "../../components/table/TableBodyAll";
import TableHeader from "../../components/table/TableHeader";
import { useAuth } from "../../context/AuthProvider";
import useApproveMulti from "../../hooks/request/useApproveMulti";
import useCountPagination from "../../hooks/request/useCountPagination";
import { RegistrationForm } from "../../model";
import { counterPagination } from "../../utils/counterPagination";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  AccordionStyled,
  AccordionSummaryStyled,
} from "../../styles/search/accordion";
import style from "../../styles/search/searchChevron.module.css";
import TableEmpty from "../../components/table/TableEmpty";

const RegisterFormTable = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [checkStateIds, setCheckStateIds] = useState<string>("");
  const [ids, setIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [chevronDir, setChevronDir] = useState(false);
  const [searchingStudentRegister, setSearchingStudentRegister] = useState<
    RegistrationForm[] | null
  >(null);

  const navigate = useNavigate();
  const allStudentReg = `/reg/form/all?pageNum=${page - 1}&pageSize=20`;
  const examFormCount = "/reg/form/count";
  const [, counterPage] = useCountPagination(examFormCount);
  const { getApproveMulti, successMulti } = useApproveMulti();

  const getListLearner = async () => {
    setLoading(true);
    try {
      let response = await getData(allStudentReg);
      setStudents(response.data);
      setLoading(false);
      //empty checkBox state if you have
      setIds([]);
    } catch (error) {
      //TODO:handle Error
      console.log("catch block of error");
      console.log(error);
      setLoading(false);
      navigate("/");
      setIds([]);
    }
  };

  const { auth } = useAuth();
  const roles = auth.roles.toString();

  //handle multi selected checkbox
  const handleCheckBox = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
      if (e.target.checked) {
        setIds((old) => [...old, id]);
      }
      if (!e.target.checked) {
        setIds((current) => {
          return current.filter((item) => item !== id);
        });
      }
    },
    []
  );

  useEffect(() => {
    getListLearner();
    setSearchingStudentRegister(null);
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [page, successMulti]);

  if (loading) {
    return <LoadingProgress />;
  }

  return (
    <Box sx={{ m: 2 }}>
      <Box component={"article"}>
        <Container maxWidth="xl">
          <Box
            component={"div"}
            sx={{ display: "flex", justifyContent: "space-between", mb: 6 }}
          >
            <Typography variant="h4"> فهرست ثبت نام</Typography>
          </Box>

          <AccordionStyled>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <AccordionSummaryStyled
                aria-controls="panel1a-content"
                id="panel1a-header"
                onClick={() => setChevronDir(!chevronDir)}
              >
                <Typography variant="button">جستجو</Typography>
                <ExpandMoreIcon
                  className={chevronDir ? style.rotate180 : style.rotate0}
                />
              </AccordionSummaryStyled>
              <Box sx={{ ml: "auto" }}>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() =>
                    getApproveMulti(
                      ids.toString(),
                      "/reg/form/multiple/approve"
                    )
                  }
                  disabled={ids.toString() === ""}
                  sx={{ mr: 0.5 }}
                >
                  تایید کردن گروهی
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() =>
                    getApproveMulti(
                      ids.toString(),
                      "/reg/form/multiple/disapprove"
                    )
                  }
                  disabled={ids.toString() === ""}
                  sx={{ mr: 0.5 }}
                >
                  رد کردن گروهی
                </Button>
                <ExcelExport
                  fileName={"Applicant Info"}
                  apiData={
                    searchingStudentRegister
                      ? searchingStudentRegister?.map((i) => i)
                      : students?.map((i) => i)
                  }
                />
              </Box>
            </Box>
            <AccordionDetails>
              <Box
                sx={{
                  width: "100%",
                  my: 3,
                }}
              >
                {/* //!component for searching student */}
                <SearchAll
                  setSearchingStudentRegister={setSearchingStudentRegister}
                  searchPage="reg"
                  chevronDir={chevronDir}
                />
              </Box>
            </AccordionDetails>
          </AccordionStyled>
          {/* //!for empty response of search return TableEmpty */}
          {searchingStudentRegister?.length === 0 && <TableEmpty />}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 400 }} aria-label="simple table">
              {/* //!for empty response of search don't return TableHeader */}
              {searchingStudentRegister?.length !== 0 && <TableHeader />}

              {/*//! while searching show the search content */}
              {!searchingStudentRegister && (
                <TableBody>
                  {students.map((RegisterUser: RegistrationForm) => {
                    return (
                      <TableBodyAll
                        key={RegisterUser.id}
                        id={RegisterUser.id}
                        roles={roles}
                        birthDate={RegisterUser.birthDate}
                        family={RegisterUser.family}
                        firstName={RegisterUser.firstName}
                        registrationCode={RegisterUser.registrationCode}
                        codeMeli={RegisterUser.codeMeli}
                        mobile={RegisterUser.mobile}
                        email={RegisterUser.email}
                        directNav="register-form"
                        gender={RegisterUser.gender}
                        checked={RegisterUser.checked}
                        handleCheckBox={handleCheckBox}
                        checkBoxDisplay={false}
                      />
                    );
                  })}
                </TableBody>
              )}
              {/* show content if searching in the box */}
              <TableBody>
                {searchingStudentRegister?.map(
                  (searchingStudentRegister: any) => {
                    return (
                      <TableBodyAll
                        roles={roles}
                        key={searchingStudentRegister?.id}
                        id={searchingStudentRegister?.id}
                        birthDate={searchingStudentRegister?.birthDate}
                        family={searchingStudentRegister?.family}
                        firstName={searchingStudentRegister?.firstName}
                        registrationCode={
                          searchingStudentRegister?.registrationCode
                        }
                        codeMeli={searchingStudentRegister?.codeMeli}
                        mobile={searchingStudentRegister?.mobile}
                        email={searchingStudentRegister?.email}
                        directNav="register-form"
                        gender={searchingStudentRegister?.gender}
                        checked={searchingStudentRegister?.checked}
                        handleCheckBox={handleCheckBox}
                        checkBoxDisplay={true}
                      />
                    );
                  }
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
      {!searchingStudentRegister && (
        <Pagination
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            my: 4,
          }}
          size="large"
          count={counterPagination(counterPage, 20)}
          variant="outlined"
          shape="rounded"
          page={page}
          onChange={(event: React.ChangeEvent<unknown>, value: number) => {
            setPage(value);
          }}
        />
      )}
    </Box>
  );
};

export default RegisterFormTable;
