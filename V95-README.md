# MARKET AI V95 — Strategy Engine Rebuild

This build extends the existing MARKET AI project directly.

Implemented in V95:
- real per-strategy execution gates for Trend, Price Action, S/R, Breakout+Retest, Pullback, EMA, RSI+Trend, Stochastic, MACD, MTF, Scalping and News mode;
- strategy-specific weights in the existing 15-factor analyzer;
- higher-timeframe conflict veto;
- WAIT / NO TRADE states when a strategy is not confirmed;
- optimal-entry window shown only after the selected strategy is confirmed;
- detailed strategy sheets: how it works, when to use, when to skip, engine checks and risk;
- premium settled-result + / − scenes and Trade Analysis action;
- History user-facing label changed to Journal;
- Reduced Motion support for new animations.

News/Fundamental does not fabricate a signal without a news/calendar feed. Real broker OTC and Stocks still require their own quote adapters.
