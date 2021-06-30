import React, {FC} from "react";

import {
    Box,
    copyAction,
    createAction,
    createNumberSetting,
    createSettings,
    createSettingsFolder,
    createStandardMenuItem,
    declare,
    FillBox,
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
            children: {
                roundTo: createNumberSetting({
                    name: "Round to",
                    description: "Number of decimal places to round to.",
                    init: 10,
                    tags: ["calculator", "round", "decimal places"],
                }),
            },
        }),
});

const Content: FC<{query: string; result: number; isApproximation: boolean}> = ({
    query,
    result,
    isApproximation,
}) => {
    const context = useIOContext();
    // const [hook] = useDataHook();

    let numberOfDigits = context?.settings.get(settings).roundTo.get() || 10;
    let equalsOrApprox = isApproximation ? "≈" : "=";
    return (
        <FillBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            padding="extraLarge">
            <Box display="table" flexGrow={1}>
                <Box
                    display="table-row"
                    color="tertiary"
                    textAlign="center"
                    css={{fontSize: "25px"}}>
                    {query} {equalsOrApprox}
                </Box>
                <hr></hr>
                <Box display="table-row" textAlign="center" css={{fontSize: "25px"}}>
                    {numberOfDigits > 0
                        ? Math.round(result * 10 ** numberOfDigits) / 10 ** numberOfDigits
                        : result}
                </Box>
            </Box>
        </FillBox>
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
        if (query.search == "") return {};
        //Get result as string
        var result = math.evaluate(query.search);
        if (result) {
            return {
                item: {
                    //Top priority
                    priority: Priority.EXTRAHIGH,

                    //Create returned item
                    item: createStandardMenuItem({
                        name: result.toString(),
                        icon: <BiCalculator />,
                        content: (
                            <Content
                                query={query.search}
                                result={result}
                                isApproximation={math.isApproximation}
                            />
                        ),
                        onExecute: () => {},
                        actionBindings: [],
                    }),
                },
            };
        } else {
            return {};
        }
    },
});
