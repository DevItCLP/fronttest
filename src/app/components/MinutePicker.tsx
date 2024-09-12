

    export function MinutePicker  (hour:number,interval: number)  {
        const options:any[] = [];
        let j:number=0;
        for (let i = 0; i < hour; i += interval) {
            options.push(
                { label: `${i}`, value: `${i}` }
            );
            j++;
        }
        return options;


    }

