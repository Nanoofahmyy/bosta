const db = require('../models/index')
const { createCheckUrl} = require('../services/monitoring')
const standardResponse = require('../utils/standardResponse')
const { NotFound} = require('../utils/Error')
const utils = require('../utils/scheduelMonitoring')

exports.createCheck = async (request, response) => {
    try {
      const check = await createCheckUrl(request )
      response.status(201).json(check);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: 'Internal server error' });
    }
  };

  exports.getAllCheck = async (request, response) => {
    try {
      let data = {}
      const check =  await db.CheckUrl.findAll({ where: { UserId:request.user.id,}})
      data.check = check
      return standardResponse.ok("get all checks ", data, response);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: 'Internal server error' });
    }
  };
  exports.getAllCheckById = async (request, response , next) => {
    try {
      let data = {}
      const check =  await db.CheckUrl.findOne({ where: { id: request.params.id , UserId:request.user.id,} })
      if (check == null) return next(new NotFound('check'));
      data.check = check
      return standardResponse.ok("get checks by id ", data, response);
    } catch (error) {
      if (error.httpStatus == 404 ) return next(error)
      console.error(error);
      response.status(500).json({ message: 'Internal server error' });
    }
  };
  exports.getAllCheckByTag = async (request, response , next) => {
    try {
      let data = {} , result=[]
      const tags = Array.isArray(request.params.tags) ? request.params.tags : [request.params.tags];

      const checks =  await db.CheckUrl.findAll({ where: { UserId:request.user.id, tags :tags } })
      data.check = checks
      return standardResponse.ok("get checks by tags ", data, response);
    } catch (error) {
      if (error.httpStatus == 404 ) return next(error)
      console.error(error);
      response.status(500).json({ message: 'Internal server error' });
    }
  };
  exports.updateCheck = async (request, response , next) => {
    try {
      let data = {} 
      const check =  await db.CheckUrl.findOne({ where: { id: request.params.id , UserId:request.user.id } })
      if (check == null) return next(new NotFound('check'));
      await check.update(request.body)
      await check.save()
      data.check = check
      return standardResponse.ok("updated  ", data, response);
    } catch (error) {
      if (error.httpStatus == 404 ) return next(error)
      console.error(error);
      response.status(500).json({ message: 'Internal server error' });
    }
  };
  exports.deleteCheck = async (request, response , next) => {
    try {
      const check =  await db.CheckUrl.findOne({ where: { id: request.params.id , UserId:request.user.id } })
      if (check == null) return next(new NotFound('check'));
        await db.CheckUrl.destroy({ where: { id: check.id , UserId:request.user.id} })
      return standardResponse.ok("deleted  ", undefined, response);
    } catch (error) {
      if (error.httpStatus == 404 ) return next(error)
      console.error(error);
      response.status(500).json({ message: 'Internal server error' });
    }
  };
