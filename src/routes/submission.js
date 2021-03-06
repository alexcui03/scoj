'use strict';

const express = require('express');
const { isIfStatement } = require('typescript');

const Submission = require('../models-build/submission').default;
const TestPoint = require('../models-build/test_point').default;
const User = require('../models-build/user').default;
const Problem = require('../models-build/problem').default;

const router = express.Router();

router.get('/', async (req, res) => {
    if (req.session.user_id){
        res.render('submissions.pug', { nowUser: await User.fromUid(req.session.user_id) });
    } else {
        res.redirect('/login')
    }
});

router.get('/:sid', async (req, res) => {
    if (req.session.user_id) {
        let submission = await Submission.fromSid(req.params.sid);
        await submission.loadUser();
        await submission.loadProblem();
        await submission.loadTestPoints();
        const data = {
            sid: submission.sid,
            uid: submission.uid,
            pid: submission.pid,
            language: submission.language,
            status: submission.status,
            total_time: submission.total_time,
            total_space: submission.total_space,
            code_size: submission.code_size,
            submit_time: submission.submit_time,
            user: {
                uid: submission.user.uid,
                username: submission.user.username,
                nickname: submission.user.nickname
            },
            problem: {
                pid: submission.problem.pid,
                title: submission.problem.title
            },
            test_points: submission.test_points
        };
        res.render('submission.pug', { data: data, nowUser: await User.fromUid(req.session.user_id)});
    } else {
        res.redirect('/login')
    }
});

module.exports = router;

