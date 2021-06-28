import React, {FC} from "react";
import {Field, useDataHook} from "model-react";
import {
    Box,
    createSettings,
    createSettingsFolder,
    createStandardMenuItem,
    declare,
    Priority,
    useIOContext,
} from "@launchmenu/core";
import {BiCalculator} from "react-icons/bi";

const info = {
    name: "Calculator",
    description: "Perform simple calculations in LaunchMenu",
    version: "0.0.0",
    icon: <BiCalculator />,
    tags: ["launchmenu-applet", "calculator"],
};

export const settings = createSettings({
    version: "0.0.0",
    settings: () =>
        createSettingsFolder({
            ...info,
            children: {},
        }),
});

const Content: FC<{query: string; result: string}> = ({query, result}) => {
    // const context = useIOContext();
    // const [hook] = useDataHook();
    return (
        <Box color="primary">
            {query} =<hr></hr>
            {result}
        </Box>
    );
};
//
const result = new Field("calculatorResult");
const getResult = (query: string) => {
    try {
        var res = eval(query);
        return res;
    } catch (e) {
        return;
    }
};

export default declare({
    info,
    settings,
    async search(query, hook) {
        var res;
        if ((res = getResult(query.search))) {
            result.set(res.toString());
            return {
                item: {
                    priority: Priority.EXTRAHIGH,
                    item: createStandardMenuItem({
                        name: h => result.get(h),
                        icon: <BiCalculator />,
                        content: <Content query={query.search} result={res} />,
                        onExecute: () => {},
                    }),
                },
            };
        } else {
            return {};
        }
    },
});
