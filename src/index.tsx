import React, {FC} from "react";

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
import MathInterpreter from "./MathInterpreter/MathInterpreter";

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

const math = new MathInterpreter();

// const res = parser.execute(field.get());
// if (res.result) alert(res.result);
// else alert("Parsing error!");

export default declare({
    info,
    settings,
    async search(query, hook) {
        //Get result as string
        var result = math.evaluate(query.search);
        if (result) {
            return {
                item: {
                    //Top priority
                    priority: Priority.EXTRAHIGH,

                    //Create returned item
                    item: createStandardMenuItem({
                        name: result,
                        icon: <BiCalculator />,
                        content: <Content query={query.search} result={result} />,
                        onExecute: () => {},
                    }),
                },
            };
        } else {
            return {};
        }
    },
});
