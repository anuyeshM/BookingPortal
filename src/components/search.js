import moment from 'moment';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';





function Search(props) {
return(
<div className='container'>
          <div className='row'>
            <div className='col-12 offset-lg-2 col-lg-8 col-md-12 col-sm-12 search_parent'>
              <div className='search_form'>
                <input
                  className='search_input'
                  type='text'
                  placeholder={placeholder}
                  aria-label='Search'
                  spellCheck='false'
                  value={searchText}
                  ref={inputRef}
                  onChange={handleFlightSearch}
                />
                <span
                  className='search_icon'
                  style={
                    searchText === ''
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                ></span>
                <span
                  className='close_icon'
                  style={
                    searchText !== ''
                      ? { display: 'inline' }
                      : { display: 'none' }
                  }
                  onClick={() => {
                    setSearchText('');
                    setShowNoResultsFound(false);
                    setFlightSuggestions([]);
                  }}
                ></span>
              </div>
              {showSuggestionsLoading ? (
                <div className='search__wrapper' style={{ display: 'block' }}>
                  <ul
                    className='search__option__list'
                    data-link='/bial/services/searchSuggestions.json'
                  ></ul>
                  <a
                    title='result'
                    className='result__link'
                    style={{ textTransform: 'none', borderBottom: 'none' }}
                  >
                    Loading...
                  </a>
                </div>
              ) : null}
              {showNoResultsFound ? (
                <div className='search__wrapper' style={{ display: 'block' }}>
                  <ul
                    className='search__option__list'
                    data-link='/bial/services/searchSuggestions.json'
                  ></ul>
                  <a
                    title='result'
                    className='result__link'
                    style={{ textTransform: 'none', borderBottom: 'none' }}
                  >
                    No Results Found...
                  </a>
                </div>
              ) : null}
              {inputRef.current?.value && flightSuggestions.length > 0 ? (
                <div
                  className='search-result'
                  style={{ display: 'block' }}
                  ref={searchResultsRef}
                >
                  <div
                    className='search-result-cards'
                    data-link='/bial/services/flightStatus.json'
                  >
                    <div className='component flight_status_cards'>
                      <div className='container'>
                        <div className='row flight-card-no-gutter'>
                          <div className='flight_status_cards-wrapper'>
                            {flightSuggestions.map((item, index) => (
                              <Link
                                to={`/travellers/flights/flight-information?selectedFlight=${item.flightNumber}&movementType=${movementType}`}
                                className='flight_status_card'
                                key={index}
                              >
                                <div
                                  className={`flight_status ${getFlightStatusClassName(
                                    item.flightStatus.name
                                  )}`}
                                >
                                  {item.flightStatus.displayName}
                                </div>
                                <div className='flight_status_logo_wrapper'>
                                  <div
                                    className='flight_owner_logo'
                                    // style={{
                                    //   borderBottom: `195px solid ${item.logobg}`,
                                    // }}
                                    style={
                                      item.airline.code &&
                                      AirlineDetails[item.airline.code]
                                        ? {
                                            borderBottom: `195px solid ${
                                              AirlineDetails[
                                                item.airline.code
                                              ].brandColor
                                            }`,
                                          }
                                        : {
                                            borderBottom: `195px solid #fff`,
                                          }
                                    }
                                  >
                                    <img
                                      className='flight_owner_logo_image'
                                      alt=''
                                      onError={(e) => {
                                        e.target.src = AirlineFallbackIcon;
                                      }}
                                      // src={
                                      //   item.logo
                                      //     ? config.imageUrlDomain.imageURL +
                                      //       item.logo.url
                                      //     : ""
                                      // }
                                      src={
                                        item.airline.code &&
                                        AirlineDetails[item.airline.code]
                                          ? config.imageUrlDomain.imageURL +
                                            AirlineDetails[item.airline.code]
                                              .logo
                                          : ''
                                      }
                                    />
                                  </div>
                                  <div className='flight_status_description_wrapper'>
                                    <div className='flight_status_description_wrapper_column1'>
                                      <div className='flight_status_flight_details'>
                                        <p className='flight__number'>
                                          {item.flightNumber}
                                        </p>
                                        <p className='flight__name small_heading'>
                                          {item.airline.displayName}
                                        </p>
                                      </div>
                                      <div className='horizontal_line'></div>
                                      <div className='flight_status_schedule_details'>
                                        <p className='flight__scheduled_label small_heading'>
                                          Scheduled
                                        </p>
                                        <p className='flight__scheduled'>
                                          {item.scheduledDate.slice(8, 10) +
                                            ':' +
                                            item.scheduledDate.slice(10, 12)}
                                          &nbsp; &nbsp;
                                          {item.scheduledDate.slice(6, 8) +
                                            ', ' +
                                            moment(
                                              item.scheduledDate.slice(4, 6),
                                              'MM'
                                            ).format('MMM') +
                                            '.'}
                                        </p>
                                        <p className='flight__estimated_label small_heading'>
                                          Estimated
                                        </p>
                                        <p
                                          className={`flight__estimated ${getFlightStatusClassName(
                                            item.flightStatus.name,
                                            true
                                          )}`}
                                        >
                                          {item.estimatedDate.slice(8, 10) +
                                            ':' +
                                            item.estimatedDate.slice(10, 12)}
                                          &nbsp; &nbsp;
                                          {item.estimatedDate.slice(6, 8) +
                                            ', ' +
                                            moment(
                                              item.estimatedDate.slice(4, 6),
                                              'MM'
                                            ).format('MMM') +
                                            '.'}
                                        </p>
                                      </div>
                                    </div>
                                    <div className='flight_status_description_wrapper_column2'>
                                      <div className='flight_status_source_and_destination_details'>
                                        <div className='flight_status_source_wrapper'>
                                          <p className='flight_status_source big_heading'>
                                            {item.originAirport.city}
                                            <label className='small_heading'>
                                              {' '}
                                              &nbsp; (
                                              {item.originAirport.code})
                                            </label>
                                          </p>
                                          <div className='flight_status_gates_terminal_wrapper'>
                                            <div className='flight_status_gate_wrapper'>
                                              <p className='flight__gate_title small_heading'>
                                                Gate{' '}
                                              </p>
                                              {item.gates.length > 0 ? (
                                                <p className='flight__gate'>
                                                  {item.gates[0].gateNumber}
                                                </p>
                                              ) : (
                                                <div className='empty-data'>
                                                  -
                                                </div>
                                              )}
                                            </div>
                                            <div className='flight_status_terminal_wrapper'>
                                              <p className='flight__terminal_title small_heading'>
                                                Terminal{' '}
                                              </p>
                                              {item.terminal ? (
                                                <p className='flight__terminal'></p>
                                              ) : (
                                                <div className='empty-data'>
                                                  -
                                                </div>
                                              )}
                                              <p></p>
                                            </div>
                                          </div>
                                        </div>
                                        <div className='flight_status_distination_wrapper'>
                                          <p className='flight_status_destination big_heading'>
                                            {item.destinationAirport.city}
                                            <label className='small_heading'>
                                              {' '}
                                              &nbsp;(
                                              {item.destinationAirport.code})
                                            </label>
                                          </p>
                                          <div className='flight_status_gates_terminal_wrapper'>
                                            <div className='flight_status_gate_wrapper'>
                                              <p className='flight__gate_title small_heading'>
                                                {' '}
                                                Belt{' '}
                                              </p>
                                              {item.baggageBelts.length >
                                              0 ? (
                                                <p className='flight__gate'>
                                                  {
                                                    item.baggageBelts[0]
                                                      .beltNumber
                                                  }
                                                </p>
                                              ) : (
                                                <div className='empty-data'>
                                                  -
                                                </div>
                                              )}
                                              <p></p>
                                            </div>
                                            <div className='flight_status_terminal_wrapper'>
                                              <p className='flight__terminal_title small_heading'>
                                                Terminal{' '}
                                              </p>
                                              {item.terminal ? (
                                                <p className='flight__terminal'></p>
                                              ) : (
                                                <div className='empty-data'>
                                                  -
                                                </div>
                                              )}
                                              <p></p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='flight_status_icon'>
                                    <img
                                      className='flight_status_icon_airpath'
                                      src={AirlinePathIcon}
                                      alt=''
                                    />
                                    <img
                                      className='flight_status_icon_airplane'
                                      src={AirlineIcon}
                                      alt=''
                                    />
                                    <img
                                      // className="flight_status_icon_airplane_cross ontime_font"
                                      className={`flight_status_icon_airplane_cross ${getFlightStatusClassName(
                                        item.flightStatus.name,
                                        true
                                      )}`}
                                      src={CrossRedIcon}
                                      alt=''
                                    />
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )};
      export default Search;
