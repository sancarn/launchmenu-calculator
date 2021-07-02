import React, {FC} from "react";

import {
    Box,
    copyAction,
    copyExitPasteHandler,
    copyTextHandler,
    createAction,
    createNumberSetting,
    createSettings,
    createSettingsFolder,
    createStandardMenuItem,
    createStandardSearchPatternMatcher,
    declare,
    FillBox,
    Priority,
    useIOContext,
} from "@launchmenu/core";
import {BiCalculator} from "react-icons/bi";
import MathInterpreter from "./MathInterpreter/MathInterpreter";
import {round} from "./MathInterpreter/MathHelpers";
import {useDataHook} from "model-react";

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
    const [h] = useDataHook();

    let numberOfDigits = context?.settings.get(settings).roundTo.get(h) ?? 10;
    let equalsOrApprox = isApproximation ? "≈" : "=";
    return (
        <FillBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            padding="extraLarge">
            <Box flexGrow={1}>
                <Box
                    color="fontBgSecondary"
                    textAlign="center"
                    css={{
                        fontSize: "25px",
                    }}>
                    {query} {equalsOrApprox}
                    <Box
                        borderBottom="normal"
                        borderColor="fontBgSecondary"
                        opacity={0.2}
                    />
                </Box>
                <Box textAlign="center" css={{fontSize: "25px"}} color="primary">
                    {numberOfDigits > 0 ? round(result, numberOfDigits) : result}
                </Box>
            </Box>
        </FillBox>
    );
};

const math = new MathInterpreter();

const searchPatternMatcher = createStandardSearchPatternMatcher({
    name: "Calculator",
    matcher: /^=/,
    highlighter: math,
});

// const res = parser.execute(field.get());
// if (res.result) alert(res.result);
// else alert("Parsing error!");

export default declare({
    info,
    settings,
    async search(query, hook) {
        if (query.search == "") return {};

        const patternMatch = searchPatternMatcher(query, hook);

        //Get result as string
        var result = math.evaluate(query.search);
        const calculation = patternMatch?.searchText ?? query.search;
        if (result) {
            return {
                patternMatch,
                item: {
                    //Top priority
                    priority: /[0-9\-]+/.test(query.search)
                        ? Priority.HIGH
                        : Priority.EXTRAHIGH,

                    //Create returned item
                    item: createStandardMenuItem({
                        name: (math.isApproximation ? "≈" : "=") + result.toString(),
                        icon: <BiCalculator />,
                        content: (
                            <Content
                                query={calculation}
                                result={result}
                                isApproximation={math.isApproximation}
                            />
                        ),
                        actionBindings: [
                            copyExitPasteHandler.createBinding({
                                copy: copyTextHandler.createBinding(result.toString()),
                            }),
                            copyAction.createBinding(
                                copyTextHandler.createBinding(result.toString())
                            ),
                        ],
                    }),
                },
            };
        } else {
            return {};
        }
    },
});
