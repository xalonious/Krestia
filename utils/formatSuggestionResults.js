const pb = {
    le: '<:bar_1:1177688291269673112>',
    me: '<:bar_2:1177688294218280990>',
    re: '<:bar_3:1177688295900196935>',
    lf: '<:bar_4:1177688298437738526>',
    mf: '<:bar_5:1177688300396494981>',
    rf: '<:bar_6:1177688304217505975>',
};

module.exports = (upvotes = [], downvotes = []) => {
    const totalVotes = upvotes.length + downvotes.length;
    const progressBarLength = 11;
    const filledSquares = Math.round((upvotes.length / totalVotes) * progressBarLength) || 0;
    const emptySquares = progressBarLength - filledSquares || 0;

    if (!filledSquares && !emptySquares) {
        emptySquares = progressBarLength;
    }

    const upPercentage = (upvotes.length / totalVotes) * 100 || 0;
    const downPercentage = (downvotes.length / totalVotes) * 100 || 0;

    const progressBar =
        (filledSquares ? pb.lf : pb.le) +
        (pb.mf.repeat(filledSquares) + pb.me.repeat(emptySquares)) +
        (filledSquares === progressBarLength ? pb.rf : pb.re);

    const results = [];
    results.push(
        `👍 ${upvotes.length} upvotes (${upPercentage.toFixed(1)}%) • 👎 ${
            downvotes.length
        } downvotes (${downPercentage.toFixed(1)}%)`
    );
    results.push(progressBar);

    return results.join('\n');
};
