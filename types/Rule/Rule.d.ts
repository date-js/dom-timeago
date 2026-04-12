import DateInterval from '../DateInterval/DateInterval';
interface Rule {
    condition: (dateInterval: DateInterval) => boolean;
    text: {
        [key: string]: string;
    };
    refresh?: number | null;
}
export default Rule;
