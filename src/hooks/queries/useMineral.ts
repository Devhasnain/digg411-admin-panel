import { useQuery } from "@tanstack/react-query";

import { mineralService } from "../../services";
import { QUERY_KEYS } from "../../config/api";


export const useFetchMinerals = (params: {
    page: number,
    rows: number,
    name: string,
    stateCode: string,
    counties: string
}) => {
    return useQuery({
        queryKey: QUERY_KEYS.MINERAL_LIST(params.page),
        queryFn: () => mineralService.fetchList(params)
    })
}

export const useMineralDetails = (id:string)=>{
    return useQuery({
        queryKey:id ? QUERY_KEYS.MINERAL_DETAIL(id) : [],
        queryFn:()=>(id ? mineralService.mineralDetails(id) : null)
    })
}