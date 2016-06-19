app.directive('pwdCheck', [function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            var firstPassword = '#' + attrs.pwCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    var v = elem.val() === $(firstPassword).val();
                    ctrl.$setValidity('pwmatch', v);
                });
            });
        }
    }
}]);
app.directive('focusMe', function ($timeout, $parse) {
    return {
        scope: {
            blur: '&',
            setFocus: '='
        },
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            console.error(scope.setFocus);
            if (element[0] && scope.setFocus) element[0].focus();
            element.bind('blur', function () {
                scope.$apply(function () {
                    if ('undefined' !== typeof scope.blur) {
                        scope.blur();
                    }
                });
            });
        }
    };
});

app.directive('topMainStrip', function ($state) {
    return {
        scope: {

        },
        templateUrl: '/Home/ksTopMainStrip',
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            scope.selectedRole = 0;
            scope.navigateAsPerRole = function (iRole) {
                console.error(iRole);
                scope.selectedRole = iRole;
                switch (iRole) {
                    case 0: $state.go('dashBoardCoachee'); break;
                    case 1: $state.go('dashBoardCoach'); break;
                    case 2: $state.go('dashBoardMentee'); break;
                    case 3: $state.go('dashBoardMentor'); break;
                }
            };
        }
    };
});
app.directive('bottomMainStrip', function ($timeout) {
    return {
        scope: {

        },
        template: '<div style="float: left;width: 100%;height: 100%;display: flex;"><ul class="bottomStripOption"><li class="fontClass" ng-repeat = "option in bottomOptionArray">{{ option.name}}</li></ul></div>',
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            console.error(scope);
            scope.bottomOptionArray = [
               { name: 'UNKNOWN 2016' },
                { name: 'USER AGREEMENT' },
                 { name: 'PRIVACY POLICY' },
                { name: 'COMMUNITY GUIDELINES' },
                { name: 'COOKIE POLICY' },
                { name: 'COPIRIGHT POLICY' },
                { name: 'QUEST CONTROLS' },
                { name: 'LANGUAGE' },

            ];
        }
    };
});

app.directive('ctcRole', function ($state, serverCommunication) {
    return {
        scope: {
            role : "@",
            skillRequired: "=",
        },
        templateUrl: '/Home/ksCtcRole',
        //scope: true,   // optionally create a child scope
        link: function (scope, element, attrs) {
            window.cts = scope;
            scope.catogoryArray = [];
            scope.topicArray = [
                 { name: 'Advertising' },
                 { name: 'Education' },
                 { name: 'Engineering' },
                 { name: 'Marketing' },
                 { name: 'BRAIN GAMES' },
                 { name: 'RESOURCES' }
            ];
            scope.skillsArray = [];
            scope.mySelection = true;
            scope.selectedCategory = -1;
            scope.selectedTopic = -1;
            scope.selectedSkills = -1;
            scope.selectedCategoryValue = null;
            scope.categoryDisplay = true;
            scope.categoryClick = function (iEvent, iIndex, iCategory) {
                scope.selectedCategory = iIndex;
                scope.categoryDisplay = false;
                scope.selectedCategoryValue = iCategory;
                scope.topicArray = [].concat(iCategory.Topics)
                for (var k = 0; k < scope.topicArray.length ; k++) {
                    scope.topicArray[k].selected = false;
                   
                }
                //    scope.getTopicSkill(iCategory);
            };

            var _updateArray = [];
            scope.topicSelection = function (iEvent, iIndex, iTopic) {
                iEvent.stopPropagation();
                if (scope.skillRequired) {
                    if (!iTopic.Skills) iTopic.Skills = [];
                    for (var k = 0; k < iTopic.Skills.length ; k++) {
                        iTopic.Skills[k].selected = false;
                    }
                }
                var _index = -1;
                for (var k = 0; k < _updateArray.length ; k++) {
                    if (_updateArray[k].Name == iTopic.Name)
                        _index = k;
                }
               
                if (iTopic.selected) {

                    iTopic.selected = false;
                    if (scope.skillRequired) {
                        if (iTopic.Skills.length > 0) {
                            var _length = scope.skillsArray.length;
                            for (var l = 0 ; l < _length;) {

                                for (var k = 0; k < iTopic.Skills.length ; k++) {
                                    
                                    var _indexSkill = -1;
                                    for (var k = 0; k < _updateArray.length ; k++) {
                                        if (_updateArray[k].Name == iTopic.Skills[k].Name)
                                            _indexSkill = k;
                                    }
                                    if (_indexSkill > -1) _updateArray.splice(_indexSkill, 1);
                                    if (scope.skillsArray[l] && scope.skillsArray[l].Name == iTopic.Skills[k].Name) {
                                        scope.skillsArray.splice(l, 1);
                                        
                                    } else {
                                        l++;
                                    }
                                }
                            }
                        }
                    } else {
                        if (_index > -1) _updateArray.splice(_index, 1);
                    }
                }
                else {
                    iTopic.selected = true;
                   
                    if (scope.skillRequired) {
                        scope.skillsArray = scope.skillsArray.concat(iTopic.Skills)
                    } else {
                        if (_index == -1) _updateArray.push(iTopic);
                    }
                }
            };
            scope.skillSelection = function (iEvent, iIndex, iSkills) {
                iEvent.stopPropagation();
                var _index = -1;
                for (var k = 0; k < _updateArray.length ; k++) {
                    if (_updateArray[k].Name == iSkills.Name)
                        _index = k;
                }
                if (iSkills.selected) {
                    iSkills.selected = false;
                    iSkills.profiLevel = 0;
                    if (_index > -1) _updateArray.splice(_index, 1);
                } else {
                    iSkills.selected = true;
                    iSkills.profiLevel = 0;
                    if (_index == -1) _updateArray.push(iSkills);
                }
            };

            scope.backButtonClick = function () {
                console.error(scope.categoryDisplay)
                if (scope.categoryDisplay == true) {
                    scope.mySelection = true;
                }
                else {
                    scope.categoryDisplay = true;
                }

                scope.skillsArray = [];
                scope.topicArray = [];
                _updateArray = [];
            };

            scope.savepublishClick = function () {
                if (scope.categoryDisplay) {
                    //publish check
                } else {
                    console.error(_updateArray);
                    if (_updateArray.length > 0) {
                        if (scope.skillRequired) {
                            serverCommunication.sendSelectedCTSDataToServer({
                                selectedArray: _updateArray,
                                successCallBack: function (iObj) {
                                    console.error('In successCallBack', iObj);
                                },
                                failureCallBack: function (iObj) {
                                    console.error('In failureCallBack', iObj);
                                }
                            });
                        } else {
                            serverCommunication.sendSelectedCTSDataToServerMentor({
                                selectedArray: _updateArray,
                                successCallBack: function (iObj) {
                                    console.error('In successCallBack', iObj);
                                },
                                failureCallBack: function (iObj) {
                                    console.error('In failureCallBack', iObj);
                                }
                            });
                            
                        }
                        _updateArray = [];
                    }
                }
            };

            scope.getTopicSkill = function (iCategory) {
                //serverCommunication.getTopicSkill({
                //    cateGoryObject: iCategory,
                //    successCallBack: function (iObj) {
                //        console.error('In successCallBack', iObj);


                //    },
                //    failureCallBack: function () {
                //        console.error('In failureCallBack', iObj);

                //    }
                //});
            };


            scope.addSkill = function () {
                scope.mySelection = false;
                scope.selectedCategory = -1;
                scope.selectedTopic = -1;
                scope.selectedSkills = -1;
                scope.selectedCategoryValue = null;
                serverCommunication.getCategorys({
                    successCallBack: function (iObj) {
                        console.error('In successCallBack', iObj);
                        var _data = JSON.parse(iObj.data);
                        console.error(_data)
                        scope.catogoryArray = [].concat(_data);
                    },
                    failureCallBack: function (iObj) {
                        console.error('In failureCallBack', iObj);

                    }
                });
            };

            scope.init = function () {
                serverCommunication.getMySelection({
                    successCallBack: function (iObj) {
                        console.error('In getMySelection', iObj);
                        
                    },
                    failureCallBack: function (iObj) {
                        console.error('In failuregetMySelectionCallBack', iObj);

                    }
                });

            };
            scope.init();
        }
    };
});

app.factory('commonFunction', function ($http) {
    return {
        fireEvent: function (element, event, iOptions) {

            var _bubble = true, _cancel = true;

            if (iOptions && 'bubble' in iOptions)
                _bubble = _bubble && iOptions.bubble;

            if (iOptions && 'cancel' in iOptions)
                _cancel = _cancel && iOptions.cancel;

            if (element) {
                if (event == "click" && (typeof InstallTrigger !== 'undefined')) {
                    element.click && element.click();
                    return;
                }

                if (document.createEvent) {
                    // dispatch for firefox + others
                    //console.log("in fireEvent");
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent(event, _bubble, _cancel); // event type,bubbling,cancelable
                    return !element.dispatchEvent(evt);
                } else {
                    // dispatch for IE
                    var evt = document.createEventObject();
                    return element.fireEvent('on' + event, evt)
                }
            }
        }
    }
});

app.directive('moleculeMap', function ($rootScope) {
    return {
        scope: {

        },
        template: '<div id="moleculeDisplay" style="float:left;width : 100%;height:100%;"></div>',// template will be different
        restrict: 'EAC',
        link: function ($scope, element, attrs) {


            var width = 994, height = 454
            var color = d3.scale.category20();
            var moleculeExamples = {};
            var radius = d3.scale.sqrt().range([0, 6]);
            var selectionGlove = glow("selectionGlove").rgb("#0000A0").stdDeviation(7);
            var atomSelected;


            var atomClicked = function (dataPoint) {
                if (dataPoint.symbol === "H")
                    return;

                if (atomSelected)
                    atomSelected.style("filter", "");

                atomSelected = d3.select(this).select("circle").style("filter", "url(#selectionGlove)");
            };

            var bondSelected;
            var bondClicked = function (dataPoint) {
                alert('New Bond Selected')
                if (bondSelected)
                    bondSelected.style("filter", "");

                bondSelected = d3.select(this).select("line").style("filter", "url(#selectionGlove)");
            };

            var generateRandomID = function () {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }

            var svg = d3.select("#moleculeDisplay").append("svg").attr("width", width).attr("height", height).call(selectionGlove);

            var getRandomInt = function (min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            }

            window.loadMolecule = function () {
                alert('loadMolecule')
                /*vex.dialog.open({
						message: 'Copy your saved molecule data:',
						input: "Molecule: <br/>\n<textarea id=\"molecule\" name=\"molecule\" value=\"\" style=\"height:150px\" placeholder=\"Saved Molecule Data\" required></textarea>",
						buttons: [
							$.extend({}, vex.dialog.buttons.YES, {
							text: 'Load'
						}), $.extend({}, vex.dialog.buttons.NO, {
							text: 'Cancel'
						})
						],
						callback: function(data) {
							if (data !== false) {
								
								newMoleculeSimulation(JSON.parse(data.molecule));
							}
						}
					});*/
            };

            var newMoleculeSimulation = function (newMolecule, example) {
                // Might be super dirty, but it works!
                $('#moleculeDisplay').empty();
                svg = d3.select("#moleculeDisplay").append("svg")
						    .attr("width", width)
						    .attr("height", height)
						    .call(selectionGlove);
                if (example)
                    newMolecule = newMolecule[example];
                newMolecule = $.extend(true, {}, newMolecule);
                orgoShmorgo(newMolecule);
                //alert('New Molecule Loaded')
                /*Messenger().post({
				  message: 'New Molecule Loaded',
				  type: 'success',
				  showCloseButton: true,
				  hideAfter: 2
				});*/
            };

            window.loadMoleculeExample = function () {
                newMoleculeSimulation(moleculeExamples, $('#moleculeExample').val().trim());
            };

            var _func = function () {
                var _retu = {
                    "3-iodo-3-methylhexan-1,4-diamine": {
                        "nodes": [
           {
               "symbol": "H",
               "size": 1,
               "id": "3d79d3f2-65de-4cf8-a4fa-a66c89a64088",
               "bonds": 1
           },
           {
               "symbol": "H",
               "size": 1,
               "id": "d83f4a48-2a50-49b1-9dc3-873363a541a3",
               "bonds": 1
           },
           {
               "symbol": "N",
               "size": 12,
               "id": "d7540a37-50e9-4480-8381-e48d483208a1",
               "bonds": 1
           },
           {
               "symbol": "H",
               "size": 1,
               "id": "5430831b-5b97-4e3c-9b7a-c60e6678529a",
               "bonds": 1
           },
           {
               "symbol": "H",
               "size": 1,
               "id": "dbafd0eb-0395-426b-80da-431ee69fcb50",
               "bonds": 1
           },
           {
               "symbol": "N",
               "size": 12,
               "id": "04c26f7d-7877-4c39-8e3c-0f506394dae8",
               "bonds": 1
           },
           {
               "symbol": "H",
               "size": 1,
               "id": "bd2f9ef7-a49f-4068-91d6-72b0c7429999",
               "bonds": 1
           },
           {
               "symbol": "H",
               "size": 1,
               "id": "cf58c989-81e5-440a-8e8c-8ea31ad0f80a",
               "bonds": 1
           },
           {
               "symbol": "H",
               "size": 1,
               "id": "4ade5fa8-8309-4fe3-b7a1-facf25e82eed",
               "bonds": 1
           },
           {
               "symbol": "H",
               "size": 1,
               "id": "9b4f6f12-bc0f-4712-a8ea-82a04eeaef63",
               "bonds": 1
           },
           {
               "symbol": "H",
               "size": 1,
               "id": "eb9d0238-f82a-4358-b08a-e15503bf6083",
               "bonds": 1
           },
           {
               "symbol": "C",
               "size": 12,
               "id": "1f0382d7-f288-4d97-8e77-25bcaa5e5785",
               "bonds": 1
           },
           {
               "symbol": "H",
               "size": 1,
               "id": "268b7540-fe82-4fb5-b844-b3acf2e275fd",
               "bonds": 1
           },
           {
               "symbol": "H",
               "size": 1,
               "id": "c99c22c3-d438-41c3-adde-54c85cce8224",
               "bonds": 1
           },
           {
               "symbol": "C",
               "size": 12,
               "id": "634581f9-2921-44b6-9931-b456b107a80c",
               "bonds": 2
           },
           {
               "symbol": "I",
               "size": 12,
               "id": "f99fd75b-82d9-405c-955e-4cacaceff591",
               "bonds": 1
           },
           {
               "symbol": "H",
               "size": 1,
               "id": "0a5db525-d856-4ef8-ba3b-4c552386bbca",
               "bonds": 1
           },
           {
               "symbol": "C",
               "size": 12,
               "id": "e9fb1029-63ad-4cbb-89e1-45338a560b85",
               "bonds": 3
           },
           {
               "symbol": "H",
               "size": 1,
               "id": "fbd61a8c-56ff-49fe-b749-89819a760823",
               "bonds": 1
           },
           {
               "symbol": "H",
               "size": 1,
               "id": "26a4131d-5fff-42f1-9939-5c63445a51ea",
               "bonds": 1
           },
           {
               "symbol": "H",
               "size": 1,
               "id": "a19b42cd-0e41-47a3-a596-efc2f00137c3",
               "bonds": 1
           },
           {
               "symbol": "C",
               "size": 12,
               "id": "b846b84a-7432-4f5d-b3ee-0ad524178f00",
               "bonds": 1
           },
           {
               "symbol": "H",
               "size": 1,
               "id": "c732798b-4daf-4d3a-8f1a-46c2f394eed2",
               "bonds": 1
           },
           {
               "symbol": "H",
               "size": 1,
               "id": 5,
               "bonds": 1
           },
           {
               "symbol": "C",
               "size": 12,
               "id": 3,
               "bonds": 2
           },
           {
               "symbol": "C",
               "size": 12,
               "id": 2,
               "bonds": 2
           },
           {
               "symbol": "C",
               "size": 12,
               "id": 1,
               "bonds": 4
           }
                        ],
                        "links": [
                            {
                                "source": 2,
                                "target": 17,
                                "id": "1567c53b-bfda-4d43-83dc-984ba6e2fdf6",
                                "bondType": 1
                            },
                            {
                                "source": 2,
                                "target": 0,
                                "id": "b2f92ef9-04bf-459f-885d-d7bded5c427f",
                                "bondType": 1
                            },
                            {
                                "source": 2,
                                "target": 1,
                                "id": "52678c9d-940d-40c2-82ce-0c8222a9dc46",
                                "bondType": 1
                            },
                            {
                                "source": 5,
                                "target": 24,
                                "id": "aaaec74a-f54a-4318-81c5-858e590b3d83",
                                "bondType": 1
                            },
                            {
                                "source": 5,
                                "target": 3,
                                "id": "38477ce0-8fc9-432a-8244-8d35cdb24df9",
                                "bondType": 1
                            },
                            {
                                "source": 5,
                                "target": 4,
                                "id": "e661cc3a-c89f-46bf-9c36-83b4618d193e",
                                "bondType": 1
                            },
                            {
                                "source": 24,
                                "target": 6,
                                "id": "c02b9262-923c-4ef2-b17e-aaa59a9327ae",
                                "bondType": 1
                            },
                            {
                                "source": 24,
                                "target": 7,
                                "id": "b6735688-82f7-4ab5-a210-c7b13427a5e2",
                                "bondType": 1
                            },
                            {
                                "source": 11,
                                "target": 14,
                                "id": "c1ceb693-3106-4d07-8164-309db8c5c230",
                                "bondType": 1
                            },
                            {
                                "source": 11,
                                "target": 8,
                                "id": "ed79fd9d-46ff-4183-8a20-e08f4d91f4c1",
                                "bondType": 1
                            },
                            {
                                "source": 11,
                                "target": 9,
                                "id": "172bed61-5fcc-4f15-a075-fd1d1556c228",
                                "bondType": 1
                            },
                            {
                                "source": 11,
                                "target": 10,
                                "id": "30deb8a1-d700-4c74-9955-640db0410534",
                                "bondType": 1
                            },
                            {
                                "source": 14,
                                "target": 17,
                                "id": "fdae62ac-6277-47c0-a650-14d17a84aeab",
                                "bondType": 1
                            },
                            {
                                "source": 14,
                                "target": 12,
                                "id": "40c3cacd-e44e-40ee-8222-e6995c7dd94b",
                                "bondType": 1
                            },
                            {
                                "source": 14,
                                "target": 13,
                                "id": "109bd1f4-3bc1-4537-b2b6-2679047a463f",
                                "bondType": 1
                            },
                            {
                                "source": 15,
                                "target": 26,
                                "id": "7fdaa31b-010b-4673-9959-7d6fa6201da5",
                                "bondType": 1
                            },
                            {
                                "source": 17,
                                "target": 26,
                                "id": "497eb54e-9162-4180-bfd4-ca602256d166",
                                "bondType": 1
                            },
                            {
                                "source": 17,
                                "target": 16,
                                "id": "6b9a64fa-36fe-4cf8-9b89-1d2fd1f7a084",
                                "bondType": 1
                            },
                            {
                                "source": 21,
                                "target": 26,
                                "id": "3713c73f-c9ac-4159-82bb-38beb402be40",
                                "bondType": 1
                            },
                            {
                                "source": 21,
                                "target": 18,
                                "id": "470461f1-5acc-4e3e-808c-622991faf8b0",
                                "bondType": 1
                            },
                            {
                                "source": 21,
                                "target": 19,
                                "id": "8f8848f9-4d89-447b-9ff1-c1a76922a3af",
                                "bondType": 1
                            },
                            {
                                "source": 21,
                                "target": 20,
                                "id": "b060103e-624e-48db-82f3-670d37ade5d6",
                                "bondType": 1
                            },
                            {
                                "source": 25,
                                "target": 22,
                                "id": "907984f1-a3fd-44d7-ad1e-597313f81069",
                                "bondType": 1
                            },
                            {
                                "source": 25,
                                "target": 23,
                                "id": 26,
                                "bondType": 1
                            },
                            {
                                "source": 25,
                                "target": 24,
                                "id": 22,
                                "bondType": 1
                            },
                            {
                                "source": 26,
                                "target": 25,
                                "id": 21,
                                "bondType": 1
                            }
                        ]
                    }
                }
                return _retu
            };

            moleculeExamples = _func();
            console.error(moleculeExamples)

            var orgoShmorgo = function (graph) {
                var nodesList, linksList;
                nodesList = graph.nodes;
                linksList = graph.links;

                var force = d3.layout.force()
                                          .nodes(nodesList)
                                          .links(linksList)
                                          .size([width, height])
                                          .charge(-400)
                                          .linkStrength(function (d) { return d.bondType * 1; })
                                          .linkDistance(function (d) { return radius(d.source.size) + radius(d.target.size) + 20; })
                                          .on("tick", tick);

                var links = force.links(),
                      nodes = force.nodes(),
                      link = svg.selectAll(".link"),
                      node = svg.selectAll(".node");

                buildMolecule();

                function buildMolecule() {
                    // Update link data
                    link = link.data(links, function (d) { return d.id; });

                    // Create new links
                    link.enter().insert("g", ".node")
                        .attr("class", "link")
                        .each(function (d) {
                            // Add bond line
                            d3.select(this)
                                .append("line")
                                        .style("stroke-width", function (d) { return (d.bondType * 3 - 2) * 2 + "px"; });

                            // If double add second line
                            d3.select(this)
                                .filter(function (d) { return d.bondType >= 2; }).append("line")
                                .style("stroke-width", function (d) { return (d.bondType * 2 - 2) * 2 + "px"; })
                                .attr("class", "double");

                            d3.select(this)
                                .filter(function (d) { return d.bondType === 3; }).append("line")
                                .attr("class", "triple");

                            // Give bond the power to be selected
                            d3.select(this)
                                .on("click", bondClicked);
                        });

                    // Delete removed links
                    link.exit().remove();

                    // Update node data
                    node = node.data(nodes, function (d) { return d.id; });

                    // Create new nodes
                    node.enter().append("g")
                        .attr("class", "node")
                        .each(function (d) {
                            // Add node circle
                            d3.select(this)
                              .append("circle")
                              .attr("r", function (d) { return radius(d.size); })
                              .style("fill", function (d) { return color(d.symbol); });

                            // Add atom symbol
                            d3.select(this)
                              .append("text")
                                      .attr("dy", ".35em")
                                      .attr("text-anchor", "middle")
                                      .text(function (d) { return d.symbol; });

                            // Give atom the power to be selected
                            d3.select(this)
                                .on("click", atomClicked);

                            // Grant atom the power of gravity	
                            d3.select(this)
                                .call(force.drag);
                        });

                    // Delete removed nodes
                    node.exit().remove();
                    force.start();
                }

                $scope.saveMolecule = function () {
                    var specialLinks = [], specialNodes = [], nodeIdArr = [];
                    for (var i = nodes.length - 1; i >= 0; i--) {
                        specialNodes.push({
                            symbol: nodes[i].symbol,
                            size: nodes[i].size,
                            x: nodes[i].x,
                            y: nodes[i].y,
                            id: nodes[i].id,
                            bonds: nodes[i].bonds
                        });
                        nodeIdArr.push(nodes[i].id);
                    }
                    for (var i = links.length - 1; i >= 0; i--) {
                        specialLinks.push({
                            source: nodeIdArr.indexOf(links[i].source.id),
                            target: nodeIdArr.indexOf(links[i].target.id),
                            id: links[i].id,
                            bondType: links[i].bondType
                        });
                    }
                    molecule = {
                        nodes: specialNodes,
                        links: specialLinks
                    };
                    /*  	vex.dialog.open({
                                message: 'To save your current molecule, copy the data below. Next time you visit click on the load molecule and input your saved data:',
                                input: "Molecule: <br/>\n<textarea id=\"atoms\" name=\"atoms\" value=\"\" style=\"height:150px\" placeholder=\"Molecule Data\">" + JSON.stringify(molecule) + "</textarea>",
                                buttons: [
                                    $.extend({}, vex.dialog.buttons.YES, {
                                        text: 'Ok'
                                    })
                                ],
                                callback: function(data) {}
                            });*/
                };

                $scope.changeBond = function (newBondType) {
                    if (!bondSelected) {
                        Messenger().post({
                            message: 'No Bond Selected',
                            type: 'error',
                            showCloseButton: true
                        });
                        return;
                    }
                    var bondData = getAtomData(bondSelected);
                    var changeInCharge = newBondType - bondData.bondType;
                    var bondChangePossible = function (bond) {
                        return (bond.target.bonds + changeInCharge <= atomDB[bond.target.symbol].lonePairs && bond.source.bonds + changeInCharge <= atomDB[bond.source.symbol].lonePairs);
                    };

                    if (!newBondType || newBondType < 1 || newBondType > 3) {
                        alert('Internal error :(')
                        return;
                    } else if (!bondChangePossible(bondData, newBondType)) {
                        alert('That type of bond cannot exist there!')
                        /*Messenger().post({
						  message: 'That type of bond cannot exist there!',
						  type: 'error',
						  showCloseButton: true
						});*/
                        return;
                    }

                    for (var i = links.length - 1; i >= 0; i--) {
                        if (links[i].id === bondData.id) {
                            var changeInCharge = newBondType - bondData.bondType;
                            var source = retriveAtom(links[i].source.id),
                                    target = retriveAtom(links[i].target.id);
                            if (changeInCharge === 2) {
                                removeHydrogen(source);
                                removeHydrogen(source);
                                removeHydrogen(target);
                                removeHydrogen(target);
                            }
                            else if (changeInCharge === 1) {
                                removeHydrogen(source);
                                removeHydrogen(target);
                            }
                            else if (changeInCharge === -1) {
                                addHydrogens(source, 1);
                                addHydrogens(target, 1);
                            }
                            else if (changeInCharge === -2) {
                                addHydrogens(source, 1);
                                addHydrogens(source, 1);
                                addHydrogens(target, 1);
                                addHydrogens(target, 1);
                            }
                            source.bonds += changeInCharge;
                            target.bonds += changeInCharge;

                            // Remove old bond, create new one and add it to links list
                            // Simple change of bond value is buggy
                            links.splice(i, 1);
                            var newBond = {
                                source: bondData.source,
                                target: bondData.target,
                                bondType: newBondType,
                                id: generateRandomID()
                            };
                            links.push(newBond);

                            // Clear previous bond selection
                            bondSelected.style("filter", "");
                            bondSelected = null;

                            break;
                        }
                    }
                    buildMolecule();
                };

                $scope.addAtom = function (atomType) {
                    if (!atomType) {
                        alert('Internal error :(')
                        return;
                    } else if (!atomSelected) {
                        alert('No Atom Selected')
                        return;
                    }
                    else if (!canHaveNewBond(getAtomData(atomSelected))) {
                        alert('Atom Can\'t Take Anymore Bonds')
                    }
                    else
                        addNewAtom(atomType, atomDB[atomType].size);
                };

                function canHaveNewBond(atom) {
                    return atom.bonds < atomDB[atom.symbol].lonePairs;
                }

                function getAtomData(d3Atom) {
                    return d3Atom[0][0].parentNode.__data__;
                }

                function addHydrogens(atom, numHydrogens) {
                    var newHydrogen = function () {
                        return {
                            symbol: 'H',
                            size: '1',
                            bonds: 1,
                            id: generateRandomID(),
                            x: atom.x + getRandomInt(-15, 15),
                            y: atom.y + getRandomInt(-15, 15)
                        };
                    };
                    var tempHydrogen;
                    for (var i = 0; i < numHydrogens; i++) {
                        tempHydrogen = newHydrogen();
                        nodes.push(tempHydrogen);
                        links.push({
                            source: atom,
                            target: tempHydrogen,
                            bondType: 1,
                            id: generateRandomID()
                        });
                    }
                }

                function removeHydrogen(oldAtom) {
                    var target, source, bondsArr = getBonds(oldAtom.id);
                    for (var i = bondsArr.length - 1; i >= 0; i--) {
                        target = bondsArr[i].target, source = bondsArr[i].source;
                        if (target.symbol === 'H' || source.symbol === 'H') {
                            var hydroId = source.symbol === 'H' ?
																				source.id :
																				target.id;
                            removeAtom(hydroId);
                            return;
                        }
                    }
                }

                function removeAtom(id) {
                    var atomToRemove = retriveAtom(id);
                    var bondsArr = getBonds(id);
                    var atomsArr = [atomToRemove.id];

                    for (var i = bondsArr.length - 1; i >= 0; i--) {
                        // Add atom that is a hydrogen
                        if (bondsArr[i].source.symbol === 'H')
                            atomsArr.push(bondsArr[i].source.id);
                        else if (bondsArr[i].target.symbol === 'H')
                            atomsArr.push(bondsArr[i].target.id);
                        else {
                            // Give non-hydrogen bonded atom it's lone pairs back
                            var nonHydrogenAtom = bondsArr[i].target.id !== id ?
                                                                                                            'target' :
                                                                                                            'source';

                            bondsArr[i][nonHydrogenAtom].bonds -= bondsArr[i].bondType;
                            addHydrogens(bondsArr[i][nonHydrogenAtom], bondsArr[i].bondType);
                        }
                        // Convert atom obj to id for later processing
                        bondsArr[i] = bondsArr[i].id;
                    }

                    var spliceOut = function (arr, removeArr) {
                        for (var i = arr.length - 1; i >= 0; i--) {
                            if (removeArr.indexOf(arr[i].id) !== -1) {
                                arr.splice(i, 1);
                            }
                        }
                        return arr;
                    };

                    // Remove atoms marked
                    nodes = spliceOut(nodes, atomsArr);

                    // Remove bonds marked
                    links = spliceOut(links, bondsArr);

                };

                var retriveAtom = function (atomID) {
                    for (var i = nodes.length - 1; i >= 0; i--) {
                        if (nodes[i].id === atomID)
                            return nodes[i];
                    }
                    return null;
                };

                function addNewAtom(atomType, atomSize) {
                    var newAtom = {
                        symbol: atomType,
                        size: atomSize,
                        x: getAtomData(atomSelected).x + getRandomInt(-15, 15),
                        y: getAtomData(atomSelected).y + getRandomInt(-15, 15),
                        id: generateRandomID(), // Need to make sure is unique
                        bonds: 1
                    },
				  		n = nodes.push(newAtom);

                    getAtomData(atomSelected).bonds++; // Increment bond count on selected atom
                    addHydrogens(newAtom, atomDB[atomType].lonePairs - 1); // Adds hydrogens to new atom
                    removeHydrogen(getAtomData(atomSelected)); // Remove hydrogen from selected atom

                    links.push({
                        source: newAtom,
                        target: getAtomData(atomSelected),
                        bondType: 1,
                        id: generateRandomID()
                    }); // Need to make sure is unique

                    buildMolecule();
                }

                var getBonds = function (atomID) {
                    var arr = [];
                    for (var i = links.length - 1; i >= 0; i--) {
                        if (links[i].source.id === atomID || links[i].target.id === atomID)
                            arr.push(links[i]);
                    }
                    return arr;
                }

                $scope.deleteAtom = function () {
                    var oneNonHydrogenBond = function (atom) {
                        var atomBonds = getBonds(atom.id);
                        var counter = 0;
                        for (var i = atomBonds.length - 1; i >= 0; i--) {
                            if (atomBonds[i].source.symbol !== 'H' && atomBonds[i].target.symbol !== 'H')
                                counter++;
                        }
                        return counter === 1;
                    };

                    if (!atomSelected) {
                        alert('No Atom Selected')
                        return;
                    }
                    else if (!oneNonHydrogenBond(getAtomData(atomSelected))) {
                        alert('Atom Must have only one non-hydrogen bond to be removed')
                        return;
                    }

                    removeAtom(getAtomData(atomSelected).id);
                    atomSelected = null;
                    buildMolecule();
                };

                function tick() {
                    //Update old and new elements
                    link.selectAll("line")
                        .attr("x1", function (d) { return d.source.x; })
                        .attr("y1", function (d) { return d.source.y; })
                        .attr("x2", function (d) { return d.target.x; })
                        .attr("y2", function (d) { return d.target.y; });

                    node.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
                }
            };
            newMoleculeSimulation(moleculeExamples, '3-iodo-3-methylhexan-1,4-diamine');

        }
    }
});


