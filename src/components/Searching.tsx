import { useState } from "react";
import AsyncSelect from "react-select/async";
import { getData } from "../api/axios";

export const SearchExam = ({ setSearchingStudentExam }: any) => {

  const [inputValue, setValue] = useState("");

  const fetchData = async (inputValue: string) => {
    try {
      const response = await getData("/exam/before/week/search", {
        params: {
          keyword: inputValue,
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const promiseOptions: any = (inputValue: string) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(fetchData(inputValue));
      }, 1500);
    });

  return (
    <>
      <AsyncSelect
        value={inputValue}
        defaultOptions
        getOptionLabel={(e: any) =>
          e.registrationForm.firstName + " " + e.registrationForm.family
        }
        getOptionValue={(e: any) =>
          e.registrationForm.firstName + e.registrationForm.family
        }
        onInputChange={(e) => setValue(e)}
        onChange={(e: any) => setSearchingStudentExam(e)}
        cacheOptions
        loadOptions={promiseOptions}
        placeholder="جستجو..."
        noOptionsMessage={() => "مهارتجو با این مشخصات یافت نشد"}
        loadingMessage={() => "لطفا کمی صبر کنید"}
      />
    </>
  );
};

export const SearchRegister = ({ setSearchingStudentRegister }: any) => {

  const [inputValue, setValue] = useState("");

  const fetchData = async (inputValue: string) => {
    try {
      const response = await getData("/reg/search", {
        params: {
          keyword: inputValue,
        },
      });
      if (response.status === 200) {
        console.log(response)
        return response.data;
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const promiseOptions: any = (inputValue: string) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(fetchData(inputValue));
      }, 1500);
    });

  return (
    <>
      <AsyncSelect
        value={inputValue}
        defaultOptions
        getOptionLabel={(e: any) =>
          e.firstName + " " + e.family
        }
        getOptionValue={(e: any) =>
          e.firstName + e.family
        }
        onInputChange={(e) => setValue(e)}
        onChange={(e: any) => setSearchingStudentRegister(e)}
        cacheOptions
        loadOptions={promiseOptions}
        placeholder="جستجو..."
        noOptionsMessage={() => "مهارتجو با این مشخصات یافت نشد"}
        loadingMessage={() => "لطفا کمی صبر کنید"}
      />
    </>
  );
};
