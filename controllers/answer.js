const Question = require("../models/Question")
const Answer = require("../models/Answer")
const CustomError = require("../helpers/error/CustomError");
const asyncHandler = require("express-async-handler");


const addNewAnswerToQuestion = asyncHandler(async (req, res, next) => {
    const information = req.body;
    const {
        question_id
    } = req.params;
    const answer = await Answer.create({
        ...information,
        user: req.user.id,
        question: question_id
    })

    res.status(200).json({
        success: true,
        data: answer
    });
});

const getAllAnswerByQuestion = asyncHandler(async (req, res, next) => {
    const {
        question_id
    } = req.params;
    const answers = await Question.findById(question_id).populate("answers")
    res.status(200).json({
        success: true,
        answers: answers
    });
});

const getSingleAnswer = asyncHandler(async (req, res, next) => {
    const {
        answer_id
    } = req.params;
    const answer = await Answer.findById(answer_id)
        .populate({
            path: "question",
            select: "title"
        })
        .populate({
            path: "user",
            select: "name profile_image"
        })
    res.status(200).json({
        success: true,
        answer
    });
});

const editAnswer = asyncHandler(async (req, res, next) => {
    const {
        answer_id
    } = req.params;
    const {
        content
    } = req.body;
    const answer = await Answer.findById(answer_id)
    answer.content = content;
    await answer.save();
    res.status(200).json({
        success: true,
        message: "answer has been changed",
        data: answer
    });
});

const deleteAnswer = asyncHandler(async (req, res, next) => {
    const {
        answer_id,
        question_id
    } = req.params;

    await Answer.findByIdAndRemove(answer_id);

    const question = await Question.findById(question_id)
    question.answers.splice(question.answers.indexOf(answer_id), 1);
    quesyion.answerCount = question.answers.lenght;
    await question.save();
    res.status(200).json({
        success: true,
        message: "answer has been deleted",
    });
});

const likeAnswer = asyncHandler(async (req, res, next) => {
    const {
        answer_id
    } = req.params;

    const answer = await Answer.findById(answer_id)
    if (answer.likes.includes(req.user.id)) {
        return next(new CustomError("You already liked this answer", 400));
    }
    answer.likes.push(req.user.id);
    await answer.save();

    return res.status(200).json({
        success: true,
        data: answer
    });
});

const undoLikeAnswer = asyncHandler(async (req, res, next) => {
    const {
        answer_id
    } = req.params;

    const answer = await Answer.findById(answer_id)

    if (!answer.likes.includes(req.user.id)) {
        return next(new CustomError("You can not undo like operation for this answer", 400));
    }

    const index = await answer.likes.indexOf(req.user.id);
    answer.likes.splice(index, 1);
    await answer.save();

    return res.status(200).json({
        success: true,
        data: answer
    });
});

module.exports = {
    addNewAnswerToQuestion,
    getAllAnswerByQuestion,
    getSingleAnswer,
    editAnswer,
    deleteAnswer,
    likeAnswer,
    undoLikeAnswer
}