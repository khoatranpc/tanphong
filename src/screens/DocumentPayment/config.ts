import { Obj } from "@/global";

const groupPaymentByNo = (data: Obj[]): Obj => {
    const groupedData = data.reduce((acc, item) => {
        const key = `${item.sotbdv}$${item.sodntt}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {});
    return groupedData;
}

export {
    groupPaymentByNo
}