import React, { useState } from 'react';
import renderHTML from 'react-render-html';
import { Button } from '@material-ui/core';
import Api from '../api-client';

export default ({ setAddFeed }) => {
	const [headlines, setHeadlines] = useState([]);
	const [website, setWebsite] = useState('');
	const [webName, setWebName] = useState('');
	const [webLink, setWebLink] = useState('');
	const [concatWebLink, setConcatWebLink] = useState('');
	const [webCountry, setWebCountry] = useState('');
	const [show, setShow] = useState(true);
	const [title, setTitle] = useState('');
	const [summary, setSummary] = useState('');
	const [image, setImage] = useState('');
	const [link, setLink] = useState('');
	const [status, setStatus] = useState(1);
	const [titleRoot, setTitleRoot] = useState('');
	const [titlePath, setTitlePath] = useState([]);
	const [summaryPath, setSummaryPath] = useState([]);
	const [linkPath, setLinkPath] = useState([]);
	const [imagePath, setImagePath] = useState([]);
	const [selectedNode, setSelectedNode] = useState([]);
	const [arrayOfOptions, setArrayOfOptions] = useState([]);
	const [arrayOfNodes, setArrayOfNodes] = useState([]);
	const [arrayOfTags, setArrayOfTags] = useState([]);
	const [showOptions, setShowOptions] = useState(false);
	const [currentOption, setCurrentOption] = useState(1);
	const [imageTag, setImageTag] = useState('');
	const [showForm, setShowForm] = useState(true);
	const [deleteHeadline, setDeleteHeadline] = useState(false);
	const [deleteScraper, setDeleteScraper] = useState(false);


	// functions

	function handleClick(e) {
		e.preventDefault();
		let currentNode = e.target
		let [path, root] = findPath(currentNode)

		let targetNode = document.querySelector(root);
		for (let i = path.length - 2; i >= 0; i--) {
			targetNode = targetNode.children[path[i]]
		}
		setSelectedNode(targetNode)
		if (status === 1) {
			setTitleRoot(root)
			setTitlePath(path)
			setTitle(targetNode.innerText)
		} else if (status === 2) {
			setSummaryPath(path)
			setSummary(targetNode.innerText)
		} else if (status === 3) {
			if (targetNode.getAttribute('src') && targetNode.getAttribute('src')[0] === 'h') {
				setImage(targetNode.src)
				setImageTag('src')
			} else if (targetNode.getAttribute('data-src') && targetNode.getAttribute('data-src')[0] === 'h') {
				setImage(targetNode.getAttribute('data-src'))
				setImageTag('data-src')
			} else if (targetNode.parentNode.getAttribute('src') && targetNode.parentNode.getAttribute('src')[0] === 'h') {
				setImage(targetNode.parentNode.getAttribute('src'))
				setImageTag('src')
				path.shift()
			} else if (targetNode.parentNode.getAttribute('data-src') && targetNode.parentNode.getAttribute('data-src')[0] === 'h') {
				setImage(targetNode.parentNode.getAttribute('data-src'))
				setImageTag('data-src')
				path.shift()
			}
			setImagePath(path)
		} else if (status === 4) {
			console.log(concatWebLink)
			if (targetNode.href) {
				if (targetNode.href[7] === 'l') setLink(concatWebLink + targetNode.href.slice(21))
				else setLink(targetNode.href)
			} else if (targetNode.parentNode.href) {
				path.shift();
				if (targetNode.parentNode.href[7] === 'l') setLink(concatWebLink + targetNode.parentNode.href.slice(21))
				else setLink(targetNode.parentNode.href)
			}
			setLinkPath(path)
		}
	}
	function findPath(currentNode) {
		let path = [];
		let root = '';
		let parentNode = currentNode.parentNode
		let children = parentNode.children
		while (currentNode.getAttribute('id') !== "externalMaster") {
			let n;
			for (let i = 0; i < children.length; i++) {
				if (children[i] === currentNode) {
					n = i;
					i = children.length
				}
			}
			path.push(n)
			if (parentNode.getAttribute('id') === "externalMaster") {
				let id = currentNode.getAttribute('id')
				let thisClass = currentNode.getAttribute('class')
				if (id) {
					id = '#' + id.trim();
					root = id
				}
				else if (thisClass) {
					thisClass = thisClass.trim().split(' ').join('.')
					thisClass = '.' + thisClass
					root = thisClass
				};
			}
			currentNode = parentNode;
			parentNode = currentNode.parentNode;
			children = parentNode.children;
		}
		return [path, root]
	}
	function deepSearch() {
		let currentNode = selectedNode.parentNode
		let localArrayOfOptions = []
		let localArrayOfNodes = []
		let localArrayOfTags = []

		function search(currentNode) {
			if (status <= 2 && currentNode.innerText && currentNode.innerText.trim().length > 5) {
				localArrayOfOptions.push(currentNode.innerText.trim())
				localArrayOfNodes.push(currentNode)
			}
			else if (status === 3) {
				if (currentNode.getAttribute('src') && currentNode.getAttribute('src')[0] === 'h') {
					localArrayOfOptions.push(currentNode.getAttribute('src'))
					localArrayOfTags.push('src')

					localArrayOfNodes.push(currentNode)
				}
				if (currentNode.getAttribute('data-src') && currentNode.getAttribute('data-src')[0] === 'h') {
					localArrayOfOptions.push(currentNode.getAttribute('data-src'))
					localArrayOfTags.push('data-src')
					localArrayOfNodes.push(currentNode)
				}
				if (currentNode.getAttribute('srcset') && currentNode.getAttribute('srcset')[0] === 'h') {
					localArrayOfOptions.push(currentNode.getAttribute('srcset'))
					localArrayOfTags.push('srcset')
					localArrayOfNodes.push(currentNode)
				}
				if (currentNode.getAttribute('data-src-md') && currentNode.getAttribute('data-src-md')[0] === 'h') {
					localArrayOfOptions.push(currentNode.getAttribute('data-src-md'))
					localArrayOfTags.push('data-src-md')
					localArrayOfNodes.push(currentNode)
				}
			}

			else if (status === 4 && currentNode.href) {
				if (currentNode.href[7] === 'l') localArrayOfOptions.push(concatWebLink + currentNode.href.slice(21))
				else localArrayOfOptions.push(currentNode.href)

				localArrayOfNodes.push(currentNode)
			}
			for (let i = 0; i < currentNode.children.length; i++) {
				search(currentNode.children[i])
			}
		}
		search(currentNode)
		if (!localArrayOfOptions.length) alert("sorry no options available")
		else {
			setArrayOfOptions(localArrayOfOptions)
			setArrayOfNodes(localArrayOfNodes)
			setArrayOfTags(localArrayOfTags)
			setShowOptions(true)
		}
	}

	function changeStatus() {
		if (status <= 4) {
			setStatus(status + 1)
		}
	}
	function toggleShow() {
		setShow(!show)
		setShowForm(true)
	}
	function submit() {
		Api.saveNewFeed(webLink, webName, webCountry, titlePath, titleRoot, summaryPath, linkPath, imagePath, imageTag)
		toggleShow();
	}
	function previousOption() {
		if (currentOption > 1) setCurrentOption(currentOption - 1)
	}
	function nextOption() {
		if (currentOption < arrayOfOptions.length) setCurrentOption(currentOption + 1)
	}
	function selectOption() {
		let node = arrayOfNodes[currentOption - 1]
		let [path, root] = findPath(node)
		console.log(node.innerText, path)
		if (status === 1) {
			setTitleRoot(root)
			setTitlePath(path)
			setTitle(arrayOfOptions[currentOption - 1])
		} else if (status === 2) {
			setSummaryPath(path)
			setSummary(arrayOfOptions[currentOption - 1])
		} else if (status === 3) {
			setImagePath(path)
			setImage(arrayOfOptions[currentOption - 1])
			setImageTag(arrayOfTags[currentOption - 1])
		} else if (status === 4) {
			setLinkPath(path)
			setLink(arrayOfOptions[currentOption - 1])
		}
		setCurrentOption(1)
		setShowOptions(false)
	}
	const handleAddressChange = (event) => {
		setWebLink(event.target.value);
	}
	const handleNameChange = (event) => {
		setWebName(event.target.value);
	}
	const handleCountryChange = (event) => {
		setWebCountry(event.target.value);
	}
	const handleSubmit = (event) => {
		event.preventDefault();
		const regex = "^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)"
		setConcatWebLink(webLink.match(regex)[0]);
		Api.getWebsite(webLink).then(result => {
			setWebsite(result.data.html.htmlBody)
		})
		setShowForm(false)
	}
	const handleCancel = () => {
		setShow(true)
		setShowForm(false)
	}
	const refresh = () => {
		Api.forceRefresh().then(result => {
			console.log(result)
		});
		Api.getHeadlines().then(result => {
			setHeadlines(result.data.headline)
		});
		setTimeout(() => {
			window.location.reload();
		}, 1000);
	}
	const toggleDeleteHeadline = () => {
		setDeleteHeadline(!deleteHeadline)
	}
	const toggleDeleteScraper = () => {
		setDeleteScraper(!deleteScraper)
	}
	const deleteItem = (headlineID, scraperID) => {
		if (deleteHeadline) Api.deleteHeadline(headlineID)
		if (deleteScraper) Api.deleteScraper(scraperID)
		setTimeout(() => {
			window.location.reload();
		}, 1000);
	}


	// render
	return (
		<div>
			<div className="app-container">
				<div className="main-header">
					<button onClick={refresh} >Refresh feed</button>
					<button onClick={toggleDeleteHeadline}  >Delete Headlines </button>
					<button onClick={toggleDeleteScraper}  >Delete Scraper </button>
				</div>
				<div>
					<div className="add-feed__container">
						<div className="">
							<h1>
								Create a new event
							</h1>
						</div>
						{showForm &&
							<form id="form" className="first-form" onSubmit={handleSubmit} autoComplete="new-password">
								<label htmlFor="httpAddress">Web Address</label>
								<input
									autoComplete="off"
									type="text"
									id="httpAddress"
									placeholder="Enter a web address..."
									onChange={handleAddressChange}
									value={webLink}>
								</input>
								<label htmlFor="name">Site name</label>
								<input
									autoComplete="off"
									type="text"
									id="name"
									placeholder="Enter a site name..."
									onChange={handleNameChange}
									value={webName}>
								</input>
								<label htmlFor="country">Country</label>
								<input
									autoComplete="off"
									type="text"
									id="country"
									placeholder="Enter a coutry code..."
									onChange={handleCountryChange}
									value={webCountry}>
								</input>
								<button className="addbutton" type="submit">Submit</button>
								<button className="" onClick={handleCancel} >Cancel</button>
							</form>
						}
					</div>

					{!showOptions && !showForm &&
						< div className="second-form">
							{(() => {
								switch (status) {
									case 1: return (
										<div>
											<h4>Select a title</h4>
											<p>{title}</p>
										</div>
									);
									case 2: return (
										<div>
											<h4>Select a Summary</h4>
											<p>{summary}</p>
										</div>
									);
									case 3: return (
										<div>
											<h4>Select a Image</h4>
											<p>{image}</p>
											<img src={image} style={{ width: 100, height: 100 }}></img>
										</div>
									);
									case 4: return (
										<div>
											<h4>Select a Link</h4>
											<p>{link}</p>
										</div>
									);
								}
							})()}
							<div className="action-buttons__container">
								<button onClick={changeStatus} >Next</button>
								<button onClick={submit} >Submit</button>
								<button onClick={deepSearch} >Not what you are looking for?</button>
								<button onClick={handleCancel} >Cancel</button>
							</div>
						</ div>
					}
					{showOptions &&
						<div>
							<div>
								Option {currentOption} out of {arrayOfOptions.length}
								<div>
									{arrayOfOptions[currentOption - 1]}
									{status === 3 &&
										<img src={arrayOfOptions[currentOption - 1]} style={{ height: 100 }}></img>
									}
								</div>
							</div>
							<button onClick={previousOption} >Previous</button>
							<button onClick={selectOption} >Select</button>
							<button onClick={nextOption} >Next</button>
						</div>
					}
				</div>
				{!showForm &&
					<div id="externalMaster" className="external" onClick={handleClick} >{renderHTML(website)}</div>
				}
			</div>

		</div >

	)
};