import axios from "./axios";

interface IPlantProps {
    type: string,
    location: string,
    limitWatering: number,
    limitTemp: number,
    pumpDevice?: number,
    soilDevice?: number
}

export const apiGetAllPlants = () => axios({
    url: '/api/plants',
    method: 'GET'
})

export const apiGetPlantByID = (plantID: string) => axios({
    url: `/api/plants/${plantID}`,
    method: 'GET'
})

export const apiCreatePlantBy = (plantProps: IPlantProps) => axios({
    url: `/api/plants`,
    method: 'POST',
    data: plantProps
})

export const apiUpdatePlantByID = (plantID: string, plantData: any) => axios({
    url: `/api/plants/${plantID}`,
    method: 'PUT',
    data: plantData, 
  });
  

export const apiDeletePlantByID = (plantID: string) => axios({
    url: `/api/plants/${plantID}`,
    method: 'DELETE'
})