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
import React, { useEffect, useState } from "react";
import { ExcelExport } from "../../components/ExcelExport";
import LoadingProgress from "../../components/LoadingProgress";
import SearchAll from "../../components/search/SearchAll";
import TableBodyAll from "../../components/table/TableBodyAll";
import TableHeader from "../../components/table/TableHeader";
import useApproveMulti from "../../hooks/request/useApproveMulti";
import useCountPagination from "../../hooks/request/useCountPagination";
import { BeforeWeekType } from "../../model";
import { counterPagination } from "../../utils/counterPagination";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  AccordionStyled,
  AccordionSummaryStyled,
} from "../../styles/search/accordion";
import style from "../../styles/search/searchChevron.module.css";
import TableEmpty from "../../components/table/TableEmpty";
import { useHandleCheckBox } from "../../hooks/request/useHandleCheckBox";
import useGetListLearner from "../../hooks/request/useGetListLearner";

const BeforeWeekTable = () => {
  const [page, setPage] = useState(1);
  const [chevronDir, setChevronDir] = useState(false);
  // these two below state level up from search component because i have to handle these state values after trigger useApproveMulti, also these just use for this page
  const [stateWaiting, setStateWaiting] = useState<boolean | null>(null); //this state is for handling statusState===null
  const [statusState, setStatusState] = useState<boolean | null>(null);
  const [searchingStudentBefore, setSearchingStudentBefore] = useState<
    BeforeWeekType[] | null
  >(null);

  const pageSize = 20;
  const studentBeforeWeek = `/exam/before/week/form/all?pageNum=${
    page - 1
  }&pageSize=${pageSize}`;
  const examFormCount = "/exam/before/week/form/count";

  const [, counterPage] = useCountPagination(examFormCount);
  const { getApproveMulti, loadingMulti } = useApproveMulti();
  const { students, getListLearner, loading } = useGetListLearner(
    studentBeforeWeek,
    loadingMulti,
    page
  );

  useEffect(() => {
    getListLearner();
    window.scrollTo(0, 0);
    setChevronDir(false); //after changing the page close search bar
  }, [getListLearner]);
  //handle multi selected checkbox
  const { handleCheckBox, ids, setIds } = useHandleCheckBox();
  useEffect(() => {
    setSearchingStudentBefore(null);
    setStateWaiting(null);
    setStatusState(null);
    setIds([]);
    // eslint-disable-next-line
  }, [loadingMulti]);

  if (loading || loadingMulti) {
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
            <Typography variant="h4"> فهرست ارزیابی</Typography>
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
                  onClick={() => {
                    getApproveMulti(
                      ids.toString(),
                      "/exam/before/week/form/multiple/approve"
                    );
                  }}
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
                      "/exam/before/week/form/multiple/disapprove"
                    )
                  }
                  disabled={ids.toString() === ""}
                  sx={{ mr: 0.5 }}
                >
                  رد کردن گروهی
                </Button>
                <ExcelExport
                  fileName={"Applicant Info"}
                  linkAll="/exam/before/week/form/all?pageNum=0&pageSize=10000000"
                  useIn="before"
                  searchData={searchingStudentBefore?.map(
                    (i) => i.registrationForm
                  )}
                />
              </Box>
            </Box>
            <AccordionDetails>
              {/* //!component for searching student */}
              <Box
                sx={{
                  width: "100%",
                  my: 3,
                }}
              >
                <SearchAll
                  setSearchingStudentBefore={setSearchingStudentBefore}
                  searchPage="beforeWeek"
                  chevronDir={chevronDir}
                  stateWaiting={stateWaiting}
                  setStateWaiting={setStateWaiting}
                  statusState={statusState}
                  setStatusState={setStatusState}
                />
              </Box>
            </AccordionDetails>
          </AccordionStyled>

          {/* //!for empty response of search return TableEmpty */}
          {searchingStudentBefore?.length === 0 && <TableEmpty />}
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 400 }} aria-label="simple table">
              {/* //!for empty response of search don't return TableHeader */}
              {searchingStudentBefore?.length !== 0 && <TableHeader />}

              {/*//! while searching show the search content */}
              {!searchingStudentBefore && (
                <TableBody>
                  {students?.map((examRegisterUser: BeforeWeekType) => {
                    const {
                      id,
                      registrationForm: {
                        birthDate,
                        family,
                        firstName,
                        registrationCode,
                        codeMeli,
                        mobile,
                        email,
                        gender,
                      },
                      acceptWeekChecked,
                    } = examRegisterUser;

                    return (
                      <TableBodyAll
                        key={id}
                        id={id}
                        birthDate={birthDate}
                        family={family}
                        firstName={firstName}
                        registrationCode={registrationCode}
                        codeMeli={codeMeli}
                        mobile={mobile}
                        email={email}
                        gender={gender}
                        directNav="before-week"
                        checked={acceptWeekChecked}
                        handleCheckBox={handleCheckBox}
                        checkBoxDisplay={false}
                      />
                    );
                  })}
                </TableBody>
              )}
              {/* show content if searching in the box */}
              <TableBody>
                {searchingStudentBefore?.map((searchingStudentBefore: any) => {
                  return (
                    <TableBodyAll
                      key={searchingStudentBefore.id}
                      id={searchingStudentBefore.id}
                      idMulti={searchingStudentBefore.id}
                      birthDate={
                        searchingStudentBefore.registrationForm.birthDate
                      }
                      family={searchingStudentBefore.registrationForm.family}
                      firstName={
                        searchingStudentBefore.registrationForm.firstName
                      }
                      registrationCode={
                        searchingStudentBefore.registrationForm.registrationCode
                      }
                      codeMeli={
                        searchingStudentBefore.registrationForm.codeMeli
                      }
                      mobile={searchingStudentBefore.registrationForm.mobile}
                      email={searchingStudentBefore.registrationForm.email}
                      gender={searchingStudentBefore.registrationForm.gender}
                      checked={searchingStudentBefore.acceptWeekChecked}
                      directNav="before-week"
                      handleCheckBox={handleCheckBox}
                      checkBoxDisplay={true}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
      {!searchingStudentBefore && (
        <Pagination
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            my: 4,
          }}
          size="large"
          count={counterPagination(counterPage, pageSize)}
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

export default BeforeWeekTable;
