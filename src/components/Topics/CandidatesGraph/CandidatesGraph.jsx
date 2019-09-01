import React from 'react';
import GenericTopic from "../GenericTopic";
import {connect} from "react-redux";
import "./CandidatesGraph.scss"
import TopicTitleBar from "../TopicTitleBar/TopicTitleBar";
import axios from "axios";
import Error from "../../Error/Error";
import TopOptions from "./TopOptions/TopOptions";
import TopicsLineGraph from "./TopicsLineGraph";
import moment from "moment";
import GenericGraph from "../../Followers/Graphs/GenericGraph";
import TweetEmbed from "react-tweet-embed/dist/tweet-embed";
import EmptySelection from "../../EmptySelection/EmptySelection";
import Loader from "../../Loader/Loader";
import PartyLineGraphSelection from "../../Similarities/PartyLineGraphSelection/PartyLineGraphSelection";
import {g3Formatter} from "../../../utils/graphFunctions";

const mapStateToProps = state => {
    return {
        candidateGraphs: state.candidateGraphs
    };
};

class CandidatesGraphConnected extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mainGraph: true,
            processedGraph: this.processGraphData(this.props.candidateGraphs),
            showErrorMessage: false,
            errorMessage: "",
            topicName: "",
            evolutionData: [],
            evolutionMax:0,
            showEvolution: false,
            showEvolutionError: false,
            activeNode: "",
            tweetId: "",
            showTweet: false,
            showTweetError: false,
        };
    }

    getTopicGraph = (topicId) => {
        axios.get(
            'http://elecciones2019.fi.uba.ar/topics/' +
            topicId +
            '?start_date=' +
            moment().subtract(8, 'days').format("YYYY-MM-DD").toString() +
            '&end_date=' +
            // "2019-08-07"
            //TODO veda
            moment() .subtract(1, 'days').format("YYYY-MM-DD").toString()
            )
            .then((response) => {
                this.props.changeMessage("hashtag");
                this.setState({
                    topicName: topicId,
                    mainGraph: false,
                    processedGraph: this.processGraphData(response.data),
                })
            })
            .catch((error) => {
                this.setState({
                    showErrorMessage: true,
                    errorMessage: "Hubo un error al cargar el grafo, intentá nuevamente más tarde",
                })
            })
    };

    getTopicEvolution = (topicId) => {
        axios.get(
            'http://elecciones2019.fi.uba.ar/topic_usage/' +
            topicId +
            '?start_date=' +
            moment().subtract(8, 'days').format("YYYY-MM-DD").toString() +
            '&end_date=' +
            // "2019-08-07"
            //TODO veda
            moment().subtract(1, 'days').format("YYYY-MM-DD").toString()
            )
            .then((response) => {
                this.setState({
                    showEvolution: true,
                    evolutionData: this.processEvolutionData(response.data, topicId),
                    evolutionMax: this.getEvolutionMax(response.data),
                    activeNode: topicId,
                    showEvolutionError: false,
                    tweetId: response.data.tweet_id,
                    showTweet: false,
                    showTweetError:false
                })
            })
            .catch((error) => {
                this.setState({
                    showEvolutionError: true,
                })
            })
    };

    getHashtagEvolution = (hashtagId) => {
        axios.get(
            'http://elecciones2019.fi.uba.ar/hashtag_usage/' +
            hashtagId +
            '?start_date=' +
            moment().subtract(8, 'days').format("YYYY-MM-DD").toString() +
            '&end_date=' +
            // "2019-08-07"
            //TODO veda
            moment().subtract(1, 'days').format("YYYY-MM-DD").toString()
        )
            .then((response) => {
                this.setState({
                    showEvolution: true,
                    evolutionData: this.processEvolutionData(response.data, hashtagId),
                    evolutionMax: this.getEvolutionMax(response.data),
                    activeNode: hashtagId,
                    showEvolutionError: false,
                    tweetId: response.data.tweet_id,
                    showTweet: false,
                    showTweetError:false
                })
            })
            .catch((error) => {
                this.setState({
                    showEvolutionError: true,
                })
            })
    };

    changeGraph = (nodeId) => {

        if(this.state.mainGraph){
            this.getTopicGraph(nodeId);
            this.getTopicEvolution(nodeId);
        } else {
            this.getHashtagEvolution(nodeId);
        }

    };

    changeToPreviousGraph = () => {
        if(!this.state.mainGraph) {
            this.props.changeMessage("topic");
            this.setState({
                showEvolution: false,
                mainGraph: true,
                processedGraph: this.processGraphData(this.props.candidateGraphs),
                showEvolutionError: false,
                tweetId: "",
                topicName:""
            })
        }
    };

    processGraphData = (currentGraph) => {
        let newProcessedGraph = {};
        const processedNodes = currentGraph.nodes.map(node => {
            let newNode = {};
            newNode["id"] = node.id;
            newNode["size"] = node.size / 100;
            return newNode;

        })
            .sort(function(nodeA, nodeB) {
                return nodeB.size - nodeA.size;
            });
        newProcessedGraph["links"] = currentGraph.links;
        newProcessedGraph["nodes"] = processedNodes;
        return newProcessedGraph;
    };

    processEvolutionData = (data, nodeId) => {
        let processedData = [];

        data["frentedetodos"].forEach((point, index) => {
            let newData = {};
            newData["date"] = moment(data.date_axis[index] * 1000).format("DD/MM/YYYY");
            newData["Frente De Todos"] = g3Formatter(data["frentedetodos"][index]);
            newData["Consenso Federal"] = g3Formatter(data["consensofederal"][index]);
            newData["Frente De Izquierda"] = g3Formatter(data["frentedeizquierda"][index]);
            newData["Juntos Por El Cambio"] = g3Formatter(data["juntosporelcambio"][index]);
            newData["Frente Despertar"] = g3Formatter(data["frentedespertar"][index]);
            newData[nodeId] = data["count_axis"][index];
            processedData.push(newData);
        });

        return processedData;
    };

    getEvolutionMax = (data) => {
        return(Math.max(Math.max.apply(Math, data.frentedetodos), Math.max.apply(Math, data.consensofederal),
            Math.max.apply(Math, data.frentedeizquierda), Math.max.apply(Math, data.juntosporelcambio),
            Math.max.apply(Math, data.frentedespertar))) * 100;
    };

    render() {
        return (
            <div>
                { !this.state.showErrorMessage ?
                    <div>
                        <div className="topic-title">
                            {!this.state.mainGraph ?
                                <span className="topic-title-text font-lg white-bc-color-light second-font-color-dark">
                                    {"Tópico: "}
                                    <strong>{this.state.topicName}</strong>
                                </span>
                                : null
                            }
                            <EmptySelection message={this.props.selectionMessage} />
                        </div>
                        <div className="main-topics">
                            <div className="top-topics flex-column followers-graph white-bc-color-light">
                                <TopicTitleBar withPrevious={false}
                                               title={(this.props.topicsShowing ? "Tópicos" : "Hashtags") +
                                                   " En Orden de Importancia"}
                                               showInfo={false}
                                               titleSize={"font-xmd"}
                                />
                                <TopOptions options={this.state.processedGraph} onClickNode={this.changeGraph}/>
                            </div>
                            <div className="topic-graph followers-graph white-bc-color-light">
                                <TopicTitleBar withPrevious={true}
                                               disabled={this.state.mainGraph}
                                               showPrevious={this.changeToPreviousGraph}
                                               title={"Grafo de " + (this.props.topicsShowing ? "Tópicos" : "Hashtags")}
                                               titleSize={"font-md"}
                                               showInfo={true}
                                               infoMessage={"Los tópicos representan un conjunto de Hashtags " +
                                               "agrupados según su contenido."}
                                />
                                <GenericTopic id={this.props.id}
                                              data={this.state.processedGraph}
                                              onClickNode={this.changeGraph}
                                />
                            </div>
                        </div>
                        {!this.state.showEvolutionError ?
                            <div>
                                {
                                    this.state.showEvolution ?
                                        <div>
                                            <div className="followers-graph white-bc-color-light">
                                                <span className="bold-text party-selection-text font-lg text-center second-font-color-dark">
                                                    {"Seleccioná múltiples partidos para ver sus relaciones con el " +
                                                    (this.state.activeNode === this.state.topicName ? "tópico: " : "hashtag: ") +
                                                    this.state.activeNode}
                                                </span>
                                                <PartyLineGraphSelection
                                                    data={this.state.evolutionData}
                                                    max={this.state.evolutionMax}
                                                />
                                            </div>
                                            <div className="main-topics">
                                                <div className="followers-graph evolution-basis white-bc-color-light">
                                                    <GenericGraph
                                                        title="Cantidad de usuarios únicos que lo usaron por día"
                                                        showLabels={false}
                                                        showInfo={false}
                                                        type={<TopicsLineGraph
                                                            data={this.state.evolutionData}
                                                            name={this.state.activeNode}
                                                        />}
                                                    />
                                                </div>
                                                {!this.state.showTweetError ?
                                                    <div>
                                                        {!this.props.topicsShowing ?
                                                            <div>
                                                                <div className="flex-column tweet-wrapper">
                                                                    <div className="tweet-title white-bc-color-light">
                                                                        <span className="bold-text font-md">
                                                                            {"Primer uso conocido del hashtag #" + this.state.activeNode}
                                                                        </span>
                                                                    </div>
                                                                    <TweetEmbed
                                                                        className={!this.state.showTweet ? "no-display" : ""}
                                                                        id={this.state.tweetId}
                                                                        options={{dnt: true, lang: "es"}}
                                                                        onTweetLoadSuccess={this.tweetSuccess}
                                                                    />
                                                                </div>
                                                                {!this.state.showTweet ? <Loader smallMargin={true} /> : null}
                                                            </div>
                                                            : null
                                                        }
                                                    </div>
                                                    : <Error noMargin={true}
                                                        errorMessage={"No se encontró el tweet que " +
                                                    "originó el hashtag #" + this.state.activeNode}
                                                    />
                                                }
                                            </div>
                                        </div>
                                        : null
                                }
                            </div>
                            : <Error noMargin={true} errorMessage="Entrá más tarde para ver la evolución histórica"/>
                        }
                    </div>
                : <Error errorMessage={this.state.errorMessage}/>
                }
            </div>
    )
    }

    tweetSuccess = (success) => {
        success === undefined ? this.setState({showTweet: false, showTweetError:true})
            : this.setState({showTweet: true, showTweetError:false});
    }
}

const CandidatesGraph = connect(mapStateToProps, null)(CandidatesGraphConnected);
export default CandidatesGraph;
