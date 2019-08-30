import React, { Component } from "react";
import { Container, Card, Icon, Image, Form, Button, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Router } from "../../routes";
import { SportContext } from "../../contexts/SportContext";
import BetDoughnutChart from "../../components/BetDoughnutChart";
import { Doughnut } from "react-chartjs-2";
import Chart from "chart.js";

import EventCard from "../../components/EventCard";

class BetNew extends Component {
	static contextType = SportContext;

	static async getInitialProps(props) {
		const sportId = props.query.sportId;
		const eventId = props.query.eventId;
		return { sportId, eventId };
	}

	constructor(props) {
		super(props);
		this.state = {
			betAmount: "",
			betSender: "testing",
			betRecipient: "",
			bettingTeam: "",
			bettingTeamDelta: "",
			errorMessage: "",
			loading: false,
			eventsData: {},
			eventSport: "",
			gameDetails: {},
			eventSpread: 0,
			homeData: {},
			awayData: {},
			spread: {}
		};

		this.onSubmit = this.onSubmit.bind(this);
		this.renderEventCard = this.renderEventCard.bind(this);
		this.eventCardTitle = this.eventCardTitle.bind(this);
		this.renderEventChart = this.renderEventChart.bind(this);
		this.chartCanvasRef = React.createRef();
	}

	componentDidMount() {
		const { sportsData } = this.context;
		let eventsData = sportsData[this.props.sportId - 1].data.events.filter(
			event => event.event_id === this.props.eventId
		);
		let eventSport = sportsData[this.props.sportId - 1].sport_name;
		let defSpreadHelper =
			eventsData[0].sport_id !== 10
				? eventsData[0].line_periods["1"].period_full_game.spread
				: eventsData[0].line_periods["2"].period_full_game.spread;
		let spread;
		let spreadTeam = (spread = eventsData[0].teams_normalized[0].is_away
			? eventsData[0].teams_normalized[0].abbreviation
			: eventsData[0].teams_normalized[1].abbreviation);

		if (defSpreadHelper.point_spread_away < defSpreadHelper.point_spread_home) {
			spread = spreadTeam + " " + defSpreadHelper.point_spread_away;
		} else {
			spread = spreadTeam + " " + defSpreadHelper.point_spread_home;
		}

		let homeData = eventsData[0].teams_normalized
			.filter(team => {
				return team.is_home;
			})
			.map(team => {
				return {
					teamName: team.name,
					teamMascot: team.mascot,
					teamAbbreviation: team.abbreviation
				};
			});
		let awayData = eventsData[0].teams_normalized
			.filter(team => {
				return team.is_away;
			})
			.map(team => {
				return {
					teamName: team.name,
					teamMascot: team.mascot,
					teamAbbreviation: team.abbreviation
				};
			});
		let gameDetails = {
			title: `${eventsData[0].teams_normalized[0].abbreviation} - ${eventsData[0].teams_normalized[1].abbreviation}`,
			venueLocation: eventsData[0].score.venue_location,
			venueName: eventsData[0].score.venue_name,
			gameTime: eventsData[0].score.event_status_detail,
			teams: {
				home: homeData[0],
				away: awayData[0]
			}
		};

		this.setState({
			eventsData: eventsData[0],
			eventSport,
			eventSpread: spread,
			gameDetails,
			homeData: homeData[0],
			awayData: awayData[0]
		});

		let spreadMoneylineFullGame = eventsData[0].line_periods["1"].period_full_game.moneyline;
		//console.log(spreadMoneylineFullGame);

		this.setState({ spread: spreadMoneylineFullGame });
	}

	onSubmit = async event => {
		event.preventDefault();
		this.setState({ loading: true, errorMessage: "" });

		try {
			await axios
				.post("http://localhost:3001/transaction/open/broadcast", {
					amount: this.state.betAmount,
					sender: this.state.betSender,
					recipient: this.state.betRecipient,
					sport: this.state.eventSport,
					event_id: this.state.eventsData.event_id,
					event_spread: this.state.eventSpread,
					gameDetails: this.state.gameDetails
				})
				.then(function(response) {
					console.log(response);
				});

			Router.push("/");
		} catch (err) {
			this.setState({ errorMessage: err.message });
		}

		this.setState({ loading: false });
	};

	eventCardTitle() {
		const { eventsData, homeData, awayData } = this.state;

		//console.log(eventsData);

		let items = [
			{
				description: (
					<div>
						<h3>{`${awayData.teamAbbreviation} @ ${homeData.teamAbbreviation}`}</h3>
					</div>
				),
				fluid: true
			}
		];

		return <Card.Group items={items} />;
	}

	renderEventChart() {
		const { eventsData, homeData, awayData, spread } = this.state;
		// some of this code is a variation on https://jsfiddle.net/cmyker/u6rr5moq/
		let originalDoughnutDraw = Chart.controllers.doughnut.prototype.draw;
		Chart.helpers.extend(Chart.controllers.doughnut.prototype, {
			draw: function() {
				originalDoughnutDraw.apply(this, arguments);

				let chart = this.chart;
				let width = chart.chart.width,
					height = chart.chart.height,
					ctx = chart.chart.ctx;

				let fontSize = (height / 175).toFixed(2);
				ctx.font = fontSize + "em sans-serif";
				ctx.textBaseline = "middle";

				let text = chart.config.data.text,
					textX = Math.round((width - ctx.measureText(text).width) / 2),
					textY = height / 2;

				ctx.fillText(text, textX, textY);
			}
		});
		let doughnutData = {
			labels: [homeData.teamAbbreviation, awayData.teamAbbreviation],
			datasets: [
				{
					data: [spread.moneyline_home, spread.moneyline_away],
					backgroundColor: ["#0B162A", "#203731"],
					hoverBackgroundColor: ["#C83803", "#FFB612"]
				}
			],
			text: `${awayData.teamAbbreviation} | ${homeData.teamAbbreviation}`
		};

		let homePecentage = (
			(Math.abs(spread.moneyline_home) /
				(Math.abs(spread.moneyline_home) + Math.abs(spread.moneyline_away))) *
			100
		).toFixed(1);
		let awayPecentage = (
			(Math.abs(spread.moneyline_away) /
				(Math.abs(spread.moneyline_home) + Math.abs(spread.moneyline_away))) *
			100
		).toFixed(1);

		return (
			<div>
				<h3>{awayPecentage}%</h3>
				<Doughnut data={doughnutData} />
				<h3>{homePecentage}%</h3>
			</div>
		);
	}

	renderEventCard() {
		const { eventsData, homeData, awayData, spread } = this.state;

		return (
			<Card fluid>
				<div>
					<h3>{`${awayData.teamAbbreviation} @ ${homeData.teamAbbreviation}`}</h3>
				</div>

				<Image
					style={{ padding: "0em" }}
					src={`../../static/media/${eventsData.sport_id}-${homeData.teamAbbreviation}-stadium.png`}
					wrapped
					ui={true}
				/>

				{this.eventCardTitle()}

				<Card.Content>
					<Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
						<Form.Field className="inline fields">
							<div className="field">
								<label>Bet Amount: </label>
								<Input
									className="field"
									labelPosition="right"
									label="$ USD"
									value={this.state.betAmount}
									onChange={event => this.setState({ betAmount: event.target.value })}
								/>

								<Button className="ui blue button" loading={this.state.loading} primary>
									Create
								</Button>
							</div>
						</Form.Field>
						<Message error header="Oops!" content={this.state.errorMessage} />
					</Form>
				</Card.Content>

				<Card.Content>
					<Card.Meta>
						<span>Betting Stats</span>
					</Card.Meta>
					<Card.Description>{this.renderEventChart()}</Card.Description>
				</Card.Content>
			</Card>
		);
	}

	render() {
		return <Layout>{this.renderEventCard()}</Layout>;
	}
}

export default BetNew;
