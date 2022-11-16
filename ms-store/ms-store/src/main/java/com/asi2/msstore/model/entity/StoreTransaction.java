package com.asi2.msstore.model.entity;

import java.sql.Timestamp;

import com.asi2.msstorepublic.model.StoreAction;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity(name = "store_transaction")
public class StoreTransaction {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;

	@Column(name = "user_id")
	private Integer userId;

	@Column(name = "card_id")
	private Integer cardId;

	private StoreAction action;
    private java.sql.Timestamp timeSt;
	
	public StoreTransaction() {
		this.timeSt=new Timestamp(System.currentTimeMillis());
	}

	public StoreTransaction( Integer userId, Integer cardId, StoreAction action) {
		super();
		this.userId = userId;
		this.cardId = cardId;
		this.action = action;
		this.timeSt=new Timestamp(System.currentTimeMillis());
	}
}