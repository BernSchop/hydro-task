import axios from 'axios';
import { ChartItem } from '../models/ChartModel';

const BASE_URL: string = 'https://run.mocky.io/v3/';

export default {
    getChartData: async (id: string): Promise<ChartItem[]> => {
        try {
            const response = await axios.get(BASE_URL + id);
            return response.data.data!;
        } catch (error) {
            return error;
        }
    }
}