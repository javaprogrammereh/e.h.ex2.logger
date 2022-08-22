const config = require('../../config')
const express = require('express')
const router = express.Router()

// middleware
const apiSuperAdmin = require('../middleware/admin/apiSuperAdmin') 
const apiSuperAdminRegister = require('../middleware/admin/apiSuperAdminRegister') 
const apiSection = require('../middleware/section/apiSection') 
//  Controllers
const { api: ControllerApi } = config.path.controllers

/// Controller
// log
const logStoreController = require(`${ControllerApi}/v1/log/storeController`)
const logIndexController = require(`${ControllerApi}/v1/log/indexController`)
const logSingleController = require(`${ControllerApi}/v1/log/singleController`)
const logUpdateController = require(`${ControllerApi}/v1/log/updateController`)
// token
const tokenLogoutController = require(`${ControllerApi}/v1/token/logoutController`)
const tokenIndexController = require(`${ControllerApi}/v1/token/indexController`)
const tokenSingleController = require(`${ControllerApi}/v1/token/singleController`)
//
// logDescription
const logDescriptionStoreController = require(`${ControllerApi}/v1/logDescription/storeController`)
const logDescriptionIndexController = require(`${ControllerApi}/v1/logDescription/indexController`)
const logDescriptionSingleController = require(`${ControllerApi}/v1/logDescription/singleController`)
const singleLogCodeController = require(`${ControllerApi}/v1/logDescription/singleLogCodeController`)
//
// project
const projectStoreController = require(`${ControllerApi}/v1/project/storeController`)
const projectIndexController = require(`${ControllerApi}/v1/project/indexController`)
const projectSingleController = require(`${ControllerApi}/v1/project/singleController`)
//
// section
const sectionStoreController = require(`${ControllerApi}/v1/section/storeController`)
const sectionIndexController = require(`${ControllerApi}/v1/section/indexController`)
const sectionSingleController = require(`${ControllerApi}/v1/section/singleController`)
//
// superAdmin
const superAdminLoginController = require(`${ControllerApi}/v1/superAdmin/loginController`)
const superAdminRegisterController = require(`${ControllerApi}/v1/superAdmin/registerController`)
//
// backup 
const backupIndexController = require(`${ControllerApi}/v1/backup/indexController`)
const backupSingleController = require(`${ControllerApi}/v1/backup/singleController`)
const backupStoreController = require(`${ControllerApi}/v1/backup/storeController`)
//
// isUp
const upCheckIsUpController = require(`${ControllerApi}/v1/upCheck/isUpController`)
/// router
//* superAdminRouter
const superAdminRouter = express.Router()
superAdminRouter.post('/register', apiSuperAdminRegister,superAdminRegisterController.register.bind(superAdminRegisterController))
superAdminRouter.post('/login', superAdminLoginController.login.bind(superAdminLoginController))
router.use('/v1', superAdminRouter)
//* token
const tokenRouter = express.Router();
tokenRouter.get("/single/:id", tokenSingleController.single.bind(tokenSingleController));
tokenRouter.get("/", tokenIndexController.index.bind(tokenIndexController));
tokenRouter.delete("/logout", tokenLogoutController.logout.bind(tokenLogoutController));
router.use("/v1/session", apiSuperAdmin, tokenRouter);
//
//* projectRouter
const projectRouter = express.Router()
projectRouter.post('/projects',apiSuperAdmin, projectStoreController.store.bind(projectStoreController))
projectRouter.get('/projects',apiSuperAdmin,projectIndexController.index.bind(projectIndexController))
projectRouter.get('/projects/:id',apiSuperAdmin,projectSingleController.single.bind(projectSingleController))
router.use('/v1', projectRouter)
////
//* sectionRouter
const sectionRouter = express.Router()
sectionRouter.post('/sections',apiSuperAdmin, sectionStoreController.store.bind(sectionStoreController))
sectionRouter.get('/sections',apiSuperAdmin,sectionIndexController.index.bind(sectionIndexController))
sectionRouter.get('/sections/:id',apiSuperAdmin,sectionSingleController.single.bind(sectionSingleController))
router.use('/v1', sectionRouter)
//
//* logRouter
const logRouter = express.Router()
logRouter.post('/logs',apiSection, logStoreController.store.bind(logStoreController))
logRouter.get('/logs',apiSuperAdmin,logIndexController.index.bind(logIndexController))
logRouter.get('/logs/:logcode',apiSuperAdmin,logSingleController.single.bind(logSingleController))
logRouter.patch('/logs',apiSuperAdmin,logUpdateController.update.bind(logUpdateController))
router.use('/v1', logRouter)
//
//* logDescriptionRouter
const logDescriptionRouter = express.Router()
logDescriptionRouter.post('/logDescriptions',apiSection, logDescriptionStoreController.store.bind(logDescriptionStoreController))
logDescriptionRouter.get('/logDescriptions',apiSuperAdmin,logDescriptionIndexController.index.bind(logDescriptionIndexController))
logDescriptionRouter.get('/logDescriptions/:id',apiSuperAdmin,logDescriptionSingleController.single.bind(logDescriptionSingleController))
logDescriptionRouter.get('/logcode',apiSuperAdmin,singleLogCodeController.singleLogCode.bind(singleLogCodeController))
router.use('/v1', logDescriptionRouter)
//
//* backup 
const backupRouter = express.Router()
backupRouter.get('/', backupIndexController.index.bind(backupIndexController));
backupRouter.get('/:backupName', backupSingleController.single.bind(backupSingleController));
backupRouter.post('/', backupStoreController.store.bind(backupStoreController));
router.use('/v1/backup', apiSuperAdmin, backupRouter);
//
//* isUp
const upCheckRouter = express.Router();
upCheckRouter.get("/isUp", upCheckIsUpController.isUp.bind(upCheckIsUpController));
router.use("/v1/upCheck", apiSection, upCheckRouter);
module.exports = router
