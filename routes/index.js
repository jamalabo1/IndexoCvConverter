const express = require('express');
const router = express.Router();
const axios = require('axios');
const moment = require('moment');

const appConfig = {
    title: "Indexo",
    name: 'Indexo'
};

const dateFormat = "DD/MM/YYYY";

function normalizeExperiences(experiences) {
    return experiences.map(experience => ({
        startDate: moment(experience.startDate).format(dateFormat),
        endDate: moment(experience.endDate).format(dateFormat),
        place: experience.place,
        role: experience.role
    }));
}

const apiUrl = new URL(process.env.API_URL);

router.get('/:style/:userId.html', function (req, res) {
    const style = req.params.style;
    const userId = req.params.userId;
    const token = req.cookies['account-token'];
    if (token === undefined) return res.status(403).end();
    const request = axios.create({
        baseURL: process.env.API_URL,
        headers: {
            ...req.headers,
            authorization: `Bearer ${token}`,
            host: apiUrl.host
        }
    });

    try {
        return request.get(`/api/users/${userId}`)
            .then((response) => {

                if (response && response.data && response.data.success) {
                    const user = response.data.response;
                    return request.get(`/api/users/${userId}/user-profile`)
                        .then((response2) => {
                            if (response2 && response2.data && response2.data.success) {
                                const userProfile = response2.data.response;
                                return res.render(`styles/${style}/index.hbs`, {
                                    app: appConfig,
                                    user,
                                    userProfile: {
                                        fullName: userProfile.fullName,
                                        city: userProfile.city,
                                        schoolName: userProfile.schoolName,
                                        languageExperiences: userProfile.languageExperiences,
                                        workExperiences: normalizeExperiences((userProfile.experiences || []).filter(x => x.type === 1)),
                                        volunteerExperiences: normalizeExperiences((userProfile.experiences || []).filter(x => x.type === 2)),
                                        birthday: moment(userProfile.birthday).format(dateFormat),
                                        skills: (userProfile.skills || []).filter(x => x.type === 1),
                                        computerSkills: (userProfile.skills || []).filter(x => x.type === 2)
                                    }
                                });
                            }
                        }).catch(error => {
                            if (error.response) {
                                res.status(error.response.status).end(error.response.data)
                            } else {
                                res.status(500).end();
                            }
                        });
                } else {
                    return res.status(500).end();
                }
            }).catch(error => {
                if (error.response) {
                    res
                        .status(error.response.status)
                        .send(error.response.data)
                } else {
                    res.status(500).end();
                }
            });
    } catch (e) {
        return res.status(500).end();
    }
});

module.exports = router;
