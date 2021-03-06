from flask import request
from flask_restful import Resource

from src.exceptions.NoCooccurrenceGraphError import NoCooccurrenceGraphError
from src.exceptions.WrongParametersError import WrongParametersError
from src.services.TopicService import TopicService
from src.util.ResponseBuilder import ResponseBuilder
from src.util.validations.RequestParameterValidator import RequestParameterValidator


class TopicsResource(Resource):

    @staticmethod
    def get(topic_id='main'):
        # Parse input
        try:
            start_date, end_date = RequestParameterValidator.check_date_window_params(request.args)
        except WrongParametersError as wpe:
            return ResponseBuilder.build_exception(wpe.message, 400)
        # Do function
        try:
            graph = TopicService.find_topic(topic_id, start_date, end_date)
            return ResponseBuilder.build(graph, 200)
        except NoCooccurrenceGraphError as nhge:
            return ResponseBuilder.build_exception(nhge.message, 400)
