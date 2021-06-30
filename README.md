# LaunchMenu-calculator applet

A simple calculator in LaunchMenu. This applet is still a work in progress. Current functionality uses custom interpreter to parse and evaluate mathematical expressions. Feature list can be found [on the megathread](https://github.com/LaunchMenu/LaunchMenu/issues/116).

![calc](docs/calculatorExample.png)

## TODO

-   [ ] Modulo operator
-   [ ] Seperated semantics
-   [ ] Bracket imbalance error suggestions
-   [ ] Copy action to copy result to clipboard (cmd+c/ctrl+c)
-   [ ] Search pattern?
    -   [ ] Consider `/^=/` like excel formula
    -   [ ] Consider a fast way to test if a query looks like a calculate-able query to prevent excessive parser runs (and slowdowns respective to that). Though maybe parser is fast enough?
-   [ ] Implement `ANS` and `M+` (save as variable)
-   [ ] Consider adding variable support
-   [ ] Plotting?
-   [ ] Integrals and Derivatives?

### Error suggestions:

```
Query: "123+224+423+3124)/4"
Suggestions: [
  "(123+224+423+3124)/4", //tokenAddition
  "123+(224+423+3124)/4", //tokenAddition
  "123+224+(423+3124)/4", //tokenAddition
  "123+224+423+(3124)/4", //tokenAddition
  "123+224+423+3124/4"   //tokenRemoval
]
```

Default action of these suggestions should replace search field with the calculation suggested
