const db = require('../models/index')
const standardResponse = require('../utils/standardResponse')
const { NotFound} = require('../utils/Error')
const { sequelize, Sequelize } = require('../config/db');
const Op = Sequelize.Op;

  exports.getAllReport = async (request, response) => {
    try {
      let data = {}
      // const check =  await db.CheckUrl.findAll({ where: {  UserId:request.user.id,} })
      // if (check == null) return next(new NotFound('check'));
      // const report =  await db.Report.findAll( { where: { CheckUrlId: check.id}})
      const report =  await db.CheckUrl.findAll({ where: { UserId:request.user.id } , include: [
        {
            model: db.Report,
        },
    ], })   
      data.reports = report
      return standardResponse.ok("get all reports ", data, response);
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: 'Internal server error' });
    }
  };
  exports.getAllReportById = async (request, response , next) => {
      try {
      let data = {}
         const check =  await db.CheckUrl.findOne({ where: { UserId:request.user.id, } })
      if (check == null) return next(new NotFound('check'));
      const report =  await db.Report.findAll({ where: {CheckUrlId: check.id , id :request.params.id } })
          if (report == null) return next(new NotFound('report'));  
      data.report = report     
      return standardResponse.ok("get reports by id ", data, response);
    } catch (error) {
      if (error.httpStatus == 404 ) return next(error)
      console.error(error);
      response.status(500).json({ message: 'Internal server error' });
    }
  };
  exports.getAllReportByTag = async (request, response , next) => {
    try {
      let data = {} 
      const tags = Array.isArray(request.params.tags) ? request.params.tags : [request.params.tags];
      const reports =  await db.CheckUrl.findAll({ where: { UserId:request.user.id, tags :tags } , include: [
          {
              model: db.Report,
          },
      ], })    
      data.reports = reports
      return standardResponse.ok("get checks by tags ", data, response);
    } catch (error) {
      if (error.httpStatus == 404 ) return next(error)
      console.error(error);
      response.status(500).json({ message: 'Internal server error' });
    }
  };

