import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

export default function HeroCard(props) {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" style={{width: '286px', height: '286px'}} src={props.hero.thumbnail.path + '.' + props.hero.thumbnail.extension} />
            <Card.Body>
                <Card.Title>{props.hero.name}</Card.Title>
                <Card.Text>
                    {props.hero.description}
                </Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
                <ListGroup.Item>Appears in {props.hero.comics.available} comics</ListGroup.Item>
            </ListGroup>
        </Card>
    );
}