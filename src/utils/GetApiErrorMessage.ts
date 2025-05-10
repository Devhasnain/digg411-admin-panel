const GetApiErrorMessage = (error?:any)=>{
    return error?.response?.data?.message ?? error?.message ?? "Some thing went wrong :(";
}

export default GetApiErrorMessage;